'use client'

import { useState } from 'react'
import { recordPayment } from '../actions'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import type { InvoiceWithRelations } from '../actions'

interface PaymentFormProps {
  invoice: InvoiceWithRelations
  onClose: () => void
  onSuccess?: () => void
}

export function PaymentForm({ invoice, onClose, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const remainingAmount = invoice.amount - (invoice.paidAmount || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const paymentAmount = parseFloat(amount)
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error('Jumlah pembayaran harus lebih dari 0')
      return
    }

    if (paymentAmount > remainingAmount) {
      toast.error('Jumlah pembayaran melebihi sisa tagihan')
      return
    }

    setIsLoading(true)
    try {
      const result = await recordPayment(invoice.id, paymentAmount, notes)
      
      if (result.success) {
        toast.success('Pembayaran berhasil dicatat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal mencatat pembayaran')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mencatat pembayaran')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Catat Pembayaran</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">No. Invoice:</span>
            <span className="font-semibold">{invoice.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Siswa:</span>
            <span className="font-semibold">{invoice.student.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Tagihan:</span>
            <span className="font-semibold">{formatCurrency(invoice.amount)}</span>
          </div>
          {invoice.paidAmount && invoice.paidAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Sudah Dibayar:</span>
              <span className="font-semibold text-green-600">{formatCurrency(invoice.paidAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Sisa Tagihan:</span>
            <span className="font-bold text-lg">{formatCurrency(remainingAmount)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Pembayaran <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              max={remainingAmount}
              step="1000"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Maksimal: {formatCurrency(remainingAmount)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan pembayaran..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Pembayaran'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
