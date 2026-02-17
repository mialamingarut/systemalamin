'use client'

import { useState, useEffect } from 'react'
import { InvoiceGenerator } from './InvoiceGenerator'
import { InvoiceList } from './InvoiceList'
import { FinancialReport } from './FinancialReport'
import { ExportButton } from './ExportButton'
import { getInvoices, getFinancialReport } from '../actions'
import type { InvoiceWithRelations } from '../actions'

export function FinancePageWrapper() {
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([])
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    paymentRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState<number | undefined>()
  const [yearFilter, setYearFilter] = useState<number | undefined>()

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [invoicesData, statsData] = await Promise.all([
        getInvoices({
          status: statusFilter,
          month: monthFilter,
          year: yearFilter,
        }),
        getFinancialReport({
          month: monthFilter,
          year: yearFilter,
        }),
      ])
      
      setInvoices(invoicesData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load finance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, monthFilter, yearFilter])

  const currentFilters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    month: monthFilter,
    year: yearFilter,
  }

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
          <p className="text-gray-600 mt-1">Kelola pembayaran dan tagihan SPP</p>
        </div>
        <div className="flex gap-3">
          <ExportButton filters={currentFilters} />
          <InvoiceGenerator onGenerated={loadData} />
        </div>
      </div>

      <FinancialReport stats={stats} />

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Daftar Tagihan</h2>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Lunas</option>
              <option value="OVERDUE">Terlambat</option>
              <option value="CANCELLED">Dibatalkan</option>
            </select>

            <select
              value={monthFilter || ''}
              onChange={(e) => setMonthFilter(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Semua Bulan</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>

            <select
              value={yearFilter || ''}
              onChange={(e) => setYearFilter(e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Semua Tahun</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        ) : (
          <InvoiceList invoices={invoices} onUpdate={loadData} />
        )}
      </div>
    </div>
  )
}
