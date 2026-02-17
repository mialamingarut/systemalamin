'use client'

import { useState } from 'react'
import { generateInvoices } from '../actions'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export function InvoiceGenerator({ onGenerated }: { onGenerated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const toast = useToast()

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const result = await generateInvoices(month, year)
      
      if (result.success && result.data) {
        toast.success(
          `Berhasil generate ${result.data.generated} tagihan. ${result.data.skipped} dilewati (sudah ada).`
        )
        setIsOpen(false)
        onGenerated?.()
      } else {
        toast.error(result.error || 'Gagal generate tagihan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat generate tagihan')
    } finally {
      setIsLoading(false)
    }
  }

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Generate Tagihan
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Tagihan SPP</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulan
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Tagihan akan dibuat untuk semua siswa aktif pada bulan dan tahun yang dipilih.
                  Siswa yang sudah memiliki tagihan akan dilewati.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
