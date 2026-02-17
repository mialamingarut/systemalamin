'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createAnnouncement, updateAnnouncement } from '../actions'
import type { AnnouncementWithRelations } from '../actions'

interface AnnouncementFormProps {
  announcement?: AnnouncementWithRelations
  academicYears: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess?: () => void
}

export function AnnouncementForm({ announcement, academicYears, onClose, onSuccess }: AnnouncementFormProps) {
  const [title, setTitle] = useState(announcement?.title || '')
  const [content, setContent] = useState(announcement?.content || '')
  const [isPinned, setIsPinned] = useState(announcement?.isPinned || false)
  const [publishDate, setPublishDate] = useState(
    announcement?.publishedAt
      ? new Date(announcement.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [academicYearId, setAcademicYearId] = useState(announcement?.academicYearId || '')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan konten harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = announcement
        ? await updateAnnouncement(announcement.id, {
            title,
            content,
            isPinned,
            publishedAt: new Date(publishDate),
          })
        : await createAnnouncement({
            title,
            content,
            isPinned,
            publishedAt: new Date(publishDate),
            academicYearId: academicYearId || undefined,
          })

      if (result.success) {
        toast.success(announcement ? 'Pengumuman berhasil diupdate' : 'Pengumuman berhasil dibuat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal menyimpan pengumuman')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan pengumuman')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {announcement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Libur Semester Genap"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konten <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten pengumuman..."
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {!announcement && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Ajaran (Opsional)
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Semua Tahun Ajaran</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
              Pin pengumuman ini di bagian atas
            </label>
          </div>

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
              {announcement ? 'Update' : 'Publikasikan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
