'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createAcademicYear, updateAcademicYear } from '../actions'
import type { AcademicYearWithRelations } from '../actions'

interface AcademicYearFormProps {
  year?: AcademicYearWithRelations
  onClose: () => void
  onSuccess?: () => void
}

export function AcademicYearForm({ year, onClose, onSuccess }: AcademicYearFormProps) {
  const [name, setName] = useState(year?.name || '')
  const [startDate, setStartDate] = useState(
    year?.startDate ? new Date(year.startDate).toISOString().split('T')[0] : ''
  )
  const [endDate, setEndDate] = useState(
    year?.endDate ? new Date(year.endDate).toISOString().split('T')[0] : ''
  )
  const [isActive, setIsActive] = useState(year?.isActive || false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !startDate || !endDate) {
      toast.error('Semua field harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = year
        ? await updateAcademicYear(year.id, {
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive,
          })
        : await createAcademicYear({
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive,
          })

      if (result.success) {
        toast.success(year ? 'Tahun ajaran berhasil diupdate' : 'Tahun ajaran berhasil dibuat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal menyimpan tahun ajaran')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan tahun ajaran')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {year ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Tahun Ajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: 2026/2027"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktifkan tahun ajaran ini
            </label>
          </div>

          {isActive && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Mengaktifkan tahun ajaran ini akan menonaktifkan tahun ajaran lain yang sedang aktif.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
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
              loading={isLoading}
              className="flex-1"
            >
              {year ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
