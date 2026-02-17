'use client'

import { useState } from 'react'
import { PaymentForm } from './PaymentForm'
import { cancelInvoice } from '../actions'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import type { InvoiceWithRelations } from '../actions'

interface InvoiceListProps {
  invoices: InvoiceWithRelations[]
  onUpdate?: () => void
}

export function InvoiceList({ invoices, onUpdate }: InvoiceListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelations | null>(null)
  const [cancellingInvoice, setCancellingInvoice] = useState<InvoiceWithRelations | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const toast = useToast()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700',
      PAID: 'bg-green-100 text-green-700',
      OVERDUE: 'bg-red-100 text-red-700',
      CANCELLED: 'bg-gray-100 text-gray-700',
    }

    const labels = {
      PENDING: 'Pending',
      PAID: 'Lunas',
      OVERDUE: 'Terlambat',
      CANCELLED: 'Dibatalkan',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleCancelInvoice = async () => {
    if (!cancellingInvoice || !cancelReason.trim()) {
      toast.error('Alasan pembatalan harus diisi')
      return
    }

    setIsConfirming(true)
    const result = await cancelInvoice(cancellingInvoice.id, cancelReason)
    setIsConfirming(false)
    
    if (result.success) {
      toast.success('Tagihan berhasil dibatalkan')
      setCancellingInvoice(null)
      setCancelReason('')
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal membatalkan tagihan')
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Belum ada tagihan</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">No. Invoice</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Siswa</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Bulan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nominal</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Dibayar</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jatuh Tempo</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const className = invoice.student.classStudents[0]?.class.name || '-'
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
              const monthYear = `${monthNames[invoice.month - 1]} ${invoice.year}`

              return (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{invoice.invoiceNo}</td>
                  <td className="py-4 px-4 text-gray-900">{invoice.student.name}</td>
                  <td className="py-4 px-4 text-gray-600">{className}</td>
                  <td className="py-4 px-4 text-gray-600">{monthYear}</td>
                  <td className="py-4 px-4 text-gray-900 font-semibold">{formatCurrency(invoice.amount)}</td>
                  <td className="py-4 px-4 text-gray-900">
                    {invoice.paidAmount ? formatCurrency(invoice.paidAmount) : '-'}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{formatDate(invoice.dueDate)}</td>
                  <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {invoice.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Bayar
                          </button>
                          <button
                            onClick={() => setCancellingInvoice(invoice)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Batal
                          </button>
                        </>
                      )}
                      {invoice.status === 'PAID' && (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <PaymentForm
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSuccess={onUpdate}
        />
      )}

      {cancellingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Batalkan Tagihan</h2>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin membatalkan tagihan {cancellingInvoice.invoiceNo}?
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Pembatalan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setCancellingInvoice(null)
                  setCancelReason('')
                }}
                disabled={isConfirming}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelInvoice}
                disabled={isConfirming}
                loading={isConfirming}
                className="flex-1"
              >
                Batalkan Tagihan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
