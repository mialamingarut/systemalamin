'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { getAllInvoicesForExport } from '../actions'
import { exportToExcel } from '@/lib/exports'

interface ExportButtonProps {
  filters: {
    status?: string
    month?: number
    year?: number
  }
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const toast = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const invoices = await getAllInvoicesForExport(filters)
      
      if (invoices.length === 0) {
        toast.error('Tidak ada data untuk diekspor')
        return
      }

      const data = invoices.map(invoice => ({
        invoiceNo: invoice.invoiceNo,
        nis: invoice.student.nis,
        studentName: invoice.student.name,
        className: invoice.student.classStudents[0]?.class.name || '-',
        month: invoice.month,
        year: invoice.year,
        amount: invoice.amount,
        paidAmount: invoice.paidAmount || 0,
        remaining: invoice.amount - (invoice.paidAmount || 0),
        status: invoice.status,
        dueDate: new Date(invoice.dueDate).toLocaleDateString('id-ID'),
        paidAt: invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('id-ID') : '-',
        notes: invoice.notes || '-',
      }))

      const columns = [
        { key: 'invoiceNo' as const, header: 'No. Invoice' },
        { key: 'nis' as const, header: 'NIS' },
        { key: 'studentName' as const, header: 'Nama Siswa' },
        { key: 'className' as const, header: 'Kelas' },
        { key: 'month' as const, header: 'Bulan' },
        { key: 'year' as const, header: 'Tahun' },
        { key: 'amount' as const, header: 'Nominal' },
        { key: 'paidAmount' as const, header: 'Dibayar' },
        { key: 'remaining' as const, header: 'Sisa' },
        { key: 'status' as const, header: 'Status' },
        { key: 'dueDate' as const, header: 'Jatuh Tempo' },
        { key: 'paidAt' as const, header: 'Tanggal Bayar' },
        { key: 'notes' as const, header: 'Catatan' },
      ]

      exportToExcel(data, columns, 'tagihan')
      toast.success('Data berhasil diekspor')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Gagal mengekspor data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="secondary" onClick={handleExport} disabled={isExporting}>
      <Download size={20} className="mr-2" />
      {isExporting ? 'Exporting...' : 'Export'}
    </Button>
  )
}
