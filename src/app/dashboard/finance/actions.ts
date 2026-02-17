'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export interface InvoiceWithRelations {
  id: string
  invoiceNo: string
  studentId: string
  academicYearId: string
  month: number
  year: number
  amount: number
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  dueDate: Date
  paidAt: Date | null
  paidAmount: number | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  student: {
    id: string
    nis: string
    name: string
    classStudents: Array<{
      class: {
        id: string
        name: string
        grade: number
      }
    }>
  }
  academicYear: {
    id: string
    name: string
  }
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Get invoices with filters
 */
export async function getInvoices(params: {
  status?: string
  month?: number
  year?: number
  studentId?: string
} = {}) {
  const { status, month, year, studentId } = params

  try {
    const where: any = {
      deletedAt: null,
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (month) {
      where.month = month
    }

    if (year) {
      where.year = year
    }

    if (studentId) {
      where.studentId = studentId
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            nis: true,
            name: true,
            classStudents: {
              select: {
                class: {
                  select: {
                    id: true,
                    name: true,
                    grade: true,
                  },
                },
              },
            },
          },
        },
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return invoices as InvoiceWithRelations[]
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    throw new Error('Failed to fetch invoices')
  }
}

/**
 * Generate invoices for a specific month/year
 */
export async function generateInvoices(
  month: number,
  year: number
): Promise<ActionResult<{ generated: number; skipped: number }>> {
  try {
    // Get SPP amount from system config
    const sppConfig = await prisma.systemConfig.findUnique({
      where: { key: 'spp_amount' },
    })

    if (!sppConfig) {
      return {
        success: false,
        error: 'SPP amount not configured in system settings',
      }
    }

    const sppAmount = parseFloat(sppConfig.value)

    // Get active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: { isActive: true },
    })

    if (!activeYear) {
      return {
        success: false,
        error: 'No active academic year found',
      }
    }

    // Get all active students
    const students = await prisma.student.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
    })

    let generated = 0
    let skipped = 0

    for (const student of students) {
      // Check if invoice already exists
      const existing = await prisma.invoice.findFirst({
        where: {
          studentId: student.id,
          month,
          year,
          academicYearId: activeYear.id,
          deletedAt: null,
        },
      })

      if (existing) {
        skipped++
        continue
      }

      // Generate invoice number: INV-YYYYMM-XXXX
      const prefix = `INV-${year}${month.toString().padStart(2, '0')}`
      const lastInvoice = await prisma.invoice.findFirst({
        where: {
          invoiceNo: {
            startsWith: prefix,
          },
        },
        orderBy: {
          invoiceNo: 'desc',
        },
      })

      let sequence = 1
      if (lastInvoice) {
        const lastSequence = parseInt(lastInvoice.invoiceNo.split('-')[2])
        sequence = lastSequence + 1
      }

      const invoiceNo = `${prefix}-${sequence.toString().padStart(4, '0')}`

      // Set due date to 10th of the month
      const dueDate = new Date(year, month - 1, 10)

      // Create invoice
      await prisma.invoice.create({
        data: {
          invoiceNo,
          studentId: student.id,
          academicYearId: activeYear.id,
          month,
          year,
          amount: sppAmount,
          status: 'PENDING',
          dueDate,
        },
      })

      generated++
    }

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'CREATE',
      entity: 'Invoice',
      details: `Generated ${generated} invoices for ${month}/${year}`,
    })

    revalidatePath('/dashboard/finance')

    return {
      success: true,
      data: { generated, skipped },
    }
  } catch (error) {
    console.error('Failed to generate invoices:', error)
    return {
      success: false,
      error: 'Failed to generate invoices',
    }
  }
}

/**
 * Record payment for an invoice
 */
export async function recordPayment(
  invoiceId: string,
  amount: number,
  notes?: string
): Promise<ActionResult<void>> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, deletedAt: null },
      include: {
        student: true,
      },
    })

    if (!invoice) {
      return {
        success: false,
        error: 'Invoice not found',
      }
    }

    if (invoice.status === 'PAID') {
      return {
        success: false,
        error: 'Invoice is already paid',
      }
    }

    if (invoice.status === 'CANCELLED') {
      return {
        success: false,
        error: 'Cannot pay a cancelled invoice',
      }
    }

    if (amount <= 0) {
      return {
        success: false,
        error: 'Payment amount must be greater than 0',
      }
    }

    // Calculate total paid amount
    const currentPaid = invoice.paidAmount || 0
    const totalPaid = currentPaid + amount

    // Determine new status
    let newStatus: 'PENDING' | 'PAID' = 'PENDING'
    if (totalPaid >= invoice.amount) {
      newStatus = 'PAID'
    }

    // Update invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: totalPaid,
        status: newStatus,
        paidAt: newStatus === 'PAID' ? new Date() : invoice.paidAt,
        notes: notes || invoice.notes,
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'Invoice',
      entityId: invoiceId,
      details: `Recorded payment of ${amount} for invoice ${invoice.invoiceNo} (Student: ${invoice.student.name})`,
    })

    revalidatePath('/dashboard/finance')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to record payment:', error)
    return {
      success: false,
      error: 'Failed to record payment',
    }
  }
}

/**
 * Get financial report statistics
 */
export async function getFinancialReport(params: {
  month?: number
  year?: number
} = {}) {
  const { month, year } = params

  try {
    const where: any = {
      deletedAt: null,
    }

    if (month) {
      where.month = month
    }

    if (year) {
      where.year = year
    }

    const invoices = await prisma.invoice.findMany({
      where,
    })

    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter(i => i.status === 'PAID').length
    const pendingInvoices = invoices.filter(i => i.status === 'PENDING').length
    const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE').length

    const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0)
    const paidAmount = invoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0)
    const outstandingAmount = totalAmount - paidAmount

    const paymentRate = totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0

    return {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalAmount,
      paidAmount,
      outstandingAmount,
      paymentRate,
    }
  } catch (error) {
    console.error('Failed to get financial report:', error)
    throw new Error('Failed to get financial report')
  }
}

/**
 * Get all invoices for export
 */
export async function getAllInvoicesForExport(params: {
  status?: string
  month?: number
  year?: number
} = {}) {
  return getInvoices(params)
}

/**
 * Cancel an invoice
 */
export async function cancelInvoice(
  invoiceId: string,
  reason: string
): Promise<ActionResult<void>> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, deletedAt: null },
      include: {
        student: true,
      },
    })

    if (!invoice) {
      return {
        success: false,
        error: 'Invoice not found',
      }
    }

    if (invoice.status === 'PAID') {
      return {
        success: false,
        error: 'Cannot cancel a paid invoice',
      }
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'CANCELLED',
        notes: reason,
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'Invoice',
      entityId: invoiceId,
      details: `Cancelled invoice ${invoice.invoiceNo} (Student: ${invoice.student.name}). Reason: ${reason}`,
    })

    revalidatePath('/dashboard/finance')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to cancel invoice:', error)
    return {
      success: false,
      error: 'Failed to cancel invoice',
    }
  }
}
