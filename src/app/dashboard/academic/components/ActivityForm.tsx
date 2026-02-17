'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { X, Upload } from 'lucide-react'
import { createActivity, updateActivity } from '../actions'
import type { ActivityWithRelations } from '../actions'

interface ActivityFormProps {
  activity?: ActivityWithRelations
  academicYears: Array<{ id: string; name: string }>
  onClose: () => void
  onSuccess?: () => void
}

export function ActivityForm({ activity, academicYears, onClose, onSuccess }: ActivityFormProps) {
  const [title, setTitle] = useState(activity?.title || '')
  const [description, setDescription] = useState(activity?.description || '')
  const [date, setDate] = useState(
    activity?.date ? new Date(activity.date).toISOString().split('T')[0] : ''
  )
  const [location, setLocation] = useState(activity?.location || '')
  const [photos, setPhotos] = useState<string[]>(
    activity?.photos ? (Array.isArray(activity.photos) ? activity.photos : JSON.parse(activity.photos)) : []
  )
  const [photoInput, setPhotoInput] = useState('')
  const [academicYearId, setAcademicYearId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!academicYearId && academicYears.length > 0) {
      const activeYear = academicYears.find(y => y.name.includes('2026'))
      setAcademicYearId(activeYear?.id || academicYears[0].id)
    }
  }, [academicYears, academicYearId])

  const handleAddPhoto = () => {
    if (!photoInput.trim()) return

    // Validate URL format
    try {
      new URL(photoInput)
      setPhotos([...photos, photoInput])
      setPhotoInput('')
    } catch {
      toast.error('URL foto tidak valid')
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !date || !academicYearId) {
      toast.error('Judul, tanggal, dan tahun ajaran harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = activity
        ? await updateActivity(activity.id, {
            title,
            description: description || undefined,
            date: new Date(date),
            location: location || undefined,
            photos: JSON.stringify(photos),
          })
        : await createActivity({
            title,
            description: description || '',
            date: new Date(date),
            location: location || undefined,
            photos: JSON.stringify(photos),
          })

      if (result.success) {
        toast.success(activity ? 'Kegiatan berhasil diupdate' : 'Kegiatan berhasil dibuat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal menyimpan kegiatan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan kegiatan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {activity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Kegiatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Peringatan Hari Kemerdekaan"
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
              placeholder="Deskripsi kegiatan..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Lapangan Sekolah"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {!activity && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Ajaran <span className="text-red-500">*</span>
              </label>
              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                required
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Kegiatan
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                placeholder="Masukkan URL foto"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddPhoto()
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddPhoto}
                variant="secondary"
              >
                <Upload size={18} className="mr-2" />
                Tambah
              </Button>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Masukkan URL foto dari internet (JPG, PNG, atau GIF)
            </p>
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
              {activity ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
