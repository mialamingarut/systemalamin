'use client'

import { useState } from 'react'
import { Image as ImageIcon, MapPin, Edit, Trash2, Plus, X } from 'lucide-react'
import { ActivityForm } from './ActivityForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { deleteActivity } from '../actions'
import type { ActivityWithRelations } from '../actions'

interface ActivityListProps {
  activities: ActivityWithRelations[]
  academicYears: Array<{ id: string; name: string }>
  onUpdate?: () => void
}

export function ActivityList({ activities, academicYears, onUpdate }: ActivityListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ActivityWithRelations | undefined>()
  const [deletingActivity, setDeletingActivity] = useState<ActivityWithRelations | null>(null)
  const [viewingGallery, setViewingGallery] = useState<ActivityWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    if (!deletingActivity) return

    setIsDeleting(true)
    const result = await deleteActivity(deletingActivity.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Kegiatan berhasil dihapus')
      setDeletingActivity(null)
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal menghapus kegiatan')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kegiatan Sekolah</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Tambah Kegiatan
        </Button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada kegiatan</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Tambah Kegiatan Pertama
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {activity.photos.length > 0 ? (
                <div
                  className="relative h-48 cursor-pointer"
                  onClick={() => setViewingGallery(activity)}
                >
                  <img
                    src={activity.photos[0]}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  {activity.photos.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                      +{activity.photos.length - 1} foto
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-2">
                  {formatDate(activity.date)}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {activity.title}
                </h3>
                {activity.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {activity.description}
                  </p>
                )}
                {activity.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin size={14} />
                    {activity.location}
                  </div>
                )}

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setEditingActivity(activity)
                      setShowForm(true)
                    }}
                    className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingActivity(activity)}
                    className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          academicYears={academicYears}
          onClose={() => {
            setShowForm(false)
            setEditingActivity(undefined)
          }}
          onSuccess={onUpdate}
        />
      )}

      {deletingActivity && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeletingActivity(null)}
          onConfirm={handleDelete}
          title="Hapus Kegiatan"
          message={`Apakah Anda yakin ingin menghapus kegiatan "${deletingActivity.title}"?`}
          confirmText="Hapus"
          loading={isDeleting}
        />
      )}

      {viewingGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl p-4">
            <button
              onClick={() => setViewingGallery(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {viewingGallery.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Array.isArray(viewingGallery.photos) ? viewingGallery.photos : JSON.parse(viewingGallery.photos)).map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${viewingGallery.title} - Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
