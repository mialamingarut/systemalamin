'use client'

import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'

interface FinancialReportProps {
  stats: {
    totalInvoices: number
    paidInvoices: number
    pendingInvoices: number
    overdueInvoices: number
    totalAmount: number
    paidAmount: number
    outstandingAmount: number
    paymentRate: number
  }
}

export function FinancialReport({ stats }: FinancialReportProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Total Tagihan</span>
          <DollarSign className="text-blue-500" size={24} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
        <p className="text-sm text-gray-500 mt-1">{stats.totalInvoices} tagihan</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Sudah Dibayar</span>
          <CheckCircle className="text-green-500" size={24} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
        <p className="text-sm text-gray-500 mt-1">{stats.paidInvoices} pembayaran</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Belum Dibayar</span>
          <Clock className="text-amber-500" size={24} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.outstandingAmount)}</p>
        <p className="text-sm text-gray-500 mt-1">{stats.pendingInvoices} pending</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Tingkat Bayar</span>
          <TrendingUp className="text-primary-500" size={24} />
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.paymentRate.toFixed(1)}%</p>
        <p className="text-sm text-gray-500 mt-1">
          {stats.paidInvoices} dari {stats.totalInvoices}
        </p>
      </div>
    </div>
  )
}
