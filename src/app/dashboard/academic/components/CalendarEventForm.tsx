'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createCalendarEvent, updateCalendarEvent } from '../actions'
import type { CalendarEventWithRelations } from '../actions'

interface CalendarEventFormProps {
  event?: CalendarEventWithRelations
  academicYears: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess?: () => void
}

export function CalendarEventForm({ event, academicYears, onClose, onSuccess }: CalendarEventFormProps) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [date, setDate] = useState(
    event?.date ? new Date(event.date).toISOString().split('T')[0] : ''
  )
  const [academicYearId, setAcademicYearId] = useState(event?.academicYearId || '')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!academicYearId && academicYears.length > 0) {
      const activeYear = academicYears.find(y => y.name.includes('2026'))
      setAcademicYearId(activeYear?.id || academicYears[0].id)
    }
  }, [academicYears, academicYearId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !date) {
      toast.error('Judul dan tanggal harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = event
        ? await updateCalendarEvent(event.id, {
            title,
            description: description || '',
            date: new Date(date),
          })
        : await createCalendarEvent({
            title,
            description: description || '',
            date: new Date(date),
            academicYearId: academicYearId || undefined,
          })

      if (result.success) {
        toast.success(event ? 'Event berhasil diupdate' : 'Event berhasil dibuat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal menyimpan event')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan event')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {event ? 'Edit Event' : 'Tambah Event Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Ujian Tengah Semester"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi event..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {!event && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Ajaran
              </label>
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Pilih Tahun Ajaran</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
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
              {event ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
