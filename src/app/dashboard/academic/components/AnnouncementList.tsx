'use client'

import { useState } from 'react'
import { Megaphone, Edit, Trash2, Plus, Pin } from 'lucide-react'
import { AnnouncementForm } from './AnnouncementForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { deleteAnnouncement } from '../actions'
import type { AnnouncementWithRelations } from '../actions'

interface AnnouncementListProps {
  announcements: AnnouncementWithRelations[]
  academicYears: Array<{ id: string; name: string }>
  onUpdate?: () => void
}

export function AnnouncementList({ announcements, academicYears, onUpdate }: AnnouncementListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementWithRelations | undefined>()
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<AnnouncementWithRelations | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    if (!deletingAnnouncement) return

    setIsDeleting(true)
    const result = await deleteAnnouncement(deletingAnnouncement.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Pengumuman berhasil dihapus')
      setDeletingAnnouncement(null)
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal menghapus pengumuman')
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const publishDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - publishDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari yang lalu`
    
    return publishDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pengumuman</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Buat Pengumuman
        </Button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada pengumuman</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Buat Pengumuman Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                        <Pin size={12} />
                        Pinned
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatDate(announcement.publishedAt)}
                    </span>
                    {announcement.academicYear && (
                      <span className="text-sm text-gray-500">
                        • {announcement.academicYear.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {announcement.title}
                  </h3>

                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {expandedId === announcement.id
                      ? announcement.content
                      : announcement.content.length > 200
                      ? `${announcement.content.substring(0, 200)}...`
                      : announcement.content}
                  </p>

                  {announcement.content.length > 200 && (
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === announcement.id ? null : announcement.id)
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 font-medium"
                    >
                      {expandedId === announcement.id ? 'Tampilkan lebih sedikit' : 'Selengkapnya'}
                    </button>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingAnnouncement(announcement)
                      setShowForm(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingAnnouncement(announcement)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AnnouncementForm
          announcement={editingAnnouncement}
          academicYears={academicYears}
          onClose={() => {
            setShowForm(false)
            setEditingAnnouncement(undefined)
          }}
          onSuccess={onUpdate}
        />
      )}

      {deletingAnnouncement && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeletingAnnouncement(null)}
          onConfirm={handleDelete}
          title="Hapus Pengumuman"
          message={`Apakah Anda yakin ingin menghapus pengumuman "${deletingAnnouncement.title}"?`}
          confirmText="Hapus"
          loading={isDeleting}
        />
      )}
    </div>
  )
}
