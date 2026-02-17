'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export interface ApplicantWithRelations {
  id: string
  registrationNo: string
  academicYearId: string
  name: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: Date
  placeOfBirth: string
  address: string
  parentName: string
  parentPhone: string
  parentEmail: string | null
  previousSchool: string | null
  photo: string | null
  birthCertificate: string | null
  familyCard: string | null
  testScore: number | null
  status: 'REGISTERED' | 'VERIFIED' | 'TESTED' | 'PASSED' | 'FAILED' | 'ENROLLED'
  notes: string | null
  registeredAt: Date
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  academicYear: {
    id: string
    name: string
  }
}

/**
 * Get applicants with status filter
 */
export async function getApplicants(params: { status?: string } = {}) {
  const { status } = params

  try {
    const where: any = {
      deletedAt: null,
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const applicants = await prisma.sPMBApplicant.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { registeredAt: 'desc' },
      ],
    })

    return applicants as ApplicantWithRelations[]
  } catch (error) {
    console.error('Failed to fetch applicants:', error)
    throw new Error('Failed to fetch applicants')
  }
}

/**
 * Get a single applicant by ID
 */
export async function getApplicantById(id: string) {
  try {
    const applicant = await prisma.sPMBApplicant.findUnique({
      where: { id, deletedAt: null },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return applicant as ApplicantWithRelations | null
  } catch (error) {
    console.error('Failed to fetch applicant:', error)
    return null
  }
}

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Verify an applicant
 */
export async function verifyApplicant(id: string): Promise<ActionResult<void>> {
  try {
    const applicant = await prisma.sPMBApplicant.findUnique({
      where: { id, deletedAt: null },
    })

    if (!applicant) {
      return {
        success: false,
        error: 'Applicant not found',
      }
    }

    if (applicant.status !== 'REGISTERED') {
      return {
        success: false,
        error: 'Only registered applicants can be verified',
      }
    }

    await prisma.sPMBApplicant.update({
      where: { id },
      data: {
        status: 'VERIFIED',
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'SPMBApplicant',
      entityId: id,
      details: `Verified applicant: ${applicant.name}`,
    })

    revalidatePath('/dashboard/spmb')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to verify applicant:', error)
    return {
      success: false,
      error: 'Failed to verify applicant',
    }
  }
}

/**
 * Input test score for an applicant
 */
export async function inputTestScore(
  id: string,
  score: number
): Promise<ActionResult<void>> {
  try {
    const applicant = await prisma.sPMBApplicant.findUnique({
      where: { id, deletedAt: null },
    })

    if (!applicant) {
      return {
        success: false,
        error: 'Applicant not found',
      }
    }

    if (applicant.status !== 'VERIFIED') {
      return {
        success: false,
        error: 'Only verified applicants can take the test',
      }
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return {
        success: false,
        error: 'Score must be between 0 and 100',
      }
    }

    await prisma.sPMBApplicant.update({
      where: { id },
      data: {
        testScore: score,
        status: 'TESTED',
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'SPMBApplicant',
      entityId: id,
      details: `Input test score for applicant: ${applicant.name} (Score: ${score})`,
    })

    revalidatePath('/dashboard/spmb')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to input test score:', error)
    return {
      success: false,
      error: 'Failed to input test score',
    }
  }
}

/**
 * Get ranking of tested applicants
 */
export async function getRanking(academicYearId?: string) {
  try {
    const where: any = {
      deletedAt: null,
      status: 'TESTED',
      testScore: { not: null },
    }

    if (academicYearId) {
      where.academicYearId = academicYearId
    }

    const applicants = await prisma.sPMBApplicant.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        testScore: 'desc',
      },
    })

    return applicants as ApplicantWithRelations[]
  } catch (error) {
    console.error('Failed to fetch ranking:', error)
    throw new Error('Failed to fetch ranking')
  }
}

/**
 * Approve an applicant
 */
export async function approveApplicant(
  id: string,
  notes?: string
): Promise<ActionResult<void>> {
  try {
    const applicant = await prisma.sPMBApplicant.findUnique({
      where: { id, deletedAt: null },
    })

    if (!applicant) {
      return {
        success: false,
        error: 'Applicant not found',
      }
    }

    if (applicant.status !== 'TESTED') {
      return {
        success: false,
        error: 'Only tested applicants can be approved',
      }
    }

    await prisma.sPMBApplicant.update({
      where: { id },
      data: {
        status: 'PASSED',
        notes,
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'SPMBApplicant',
      entityId: id,
      details: `Approved applicant: ${applicant.name}`,
    })

    // TODO: Send email notification

    revalidatePath('/dashboard/spmb')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to approve applicant:', error)
    return {
      success: false,
      error: 'Failed to approve applicant',
    }
  }
}

/**
 * Reject an applicant
 */
export async function rejectApplicant(
  id: string,
  notes: string
): Promise<ActionResult<void>> {
  try {
    const applicant = await prisma.sPMBApplicant.findUnique({
      where: { id, deletedAt: null },
    })

    if (!applicant) {
      return {
        success: false,
        error: 'Applicant not found',
      }
    }

    if (applicant.status !== 'TESTED') {
      return {
        success: false,
        error: 'Only tested applicants can be rejected',
      }
    }

    await prisma.sPMBApplicant.update({
      where: { id },
      data: {
        status: 'FAILED',
        notes,
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'SPMBApplicant',
      entityId: id,
      details: `Rejected applicant: ${applicant.name}`,
    })

    // TODO: Send email notification

    revalidatePath('/dashboard/spmb')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to reject applicant:', error)
    return {
      success: false,
      error: 'Failed to reject applicant',
    }
  }
}

/**
 * Generate registration form PDF
 */
export async function generateRegistrationPDF(id: string): Promise<ActionResult<string>> {
  try {
    const applicant = await getApplicantById(id)

    if (!applicant) {
      return {
        success: false,
        error: 'Applicant not found',
      }
    }

    // TODO: Implement PDF generation with jspdf
    // For now, return a placeholder URL
    const pdfUrl = `/api/spmb/registration-form/${id}`

    return {
      success: true,
      data: pdfUrl,
    }
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return {
      success: false,
      error: 'Failed to generate registration form',
    }
  }
}
