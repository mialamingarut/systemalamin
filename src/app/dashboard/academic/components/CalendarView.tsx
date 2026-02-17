'use client'

import { useState } from 'react'
import { Calendar, MapPin, Edit, Trash2, Plus } from 'lucide-react'
import { CalendarEventForm } from './CalendarEventForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { deleteCalendarEvent } from '../actions'
import type { CalendarEventWithRelations } from '../actions'

interface CalendarViewProps {
  events: CalendarEventWithRelations[]
  academicYears: Array<{ id: string; name: string }>
  onUpdate?: () => void
}

export function CalendarView({ events, academicYears, onUpdate }: CalendarViewProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEventWithRelations | undefined>()
  const [deletingEvent, setDeletingEvent] = useState<CalendarEventWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    if (!deletingEvent) return

    setIsDeleting(true)
    const result = await deleteCalendarEvent(deletingEvent.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Event berhasil dihapus')
      setDeletingEvent(null)
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal menghapus event')
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDateShort = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    })
  }

  // Group events by month
  const groupedEvents = events.reduce((acc, event) => {
    const monthYear = new Date(event.date).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(event)
    return acc
  }, {} as Record<string, CalendarEventWithRelations[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kalender Akademik</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Tambah Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada event di kalender</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Tambah Event Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{monthYear}</h3>
              <div className="space-y-3">
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateShort(event.date)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event)
                          setShowForm(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeletingEvent(event)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CalendarEventForm
          event={editingEvent}
          academicYears={academicYears}
          onClose={() => {
            setShowForm(false)
            setEditingEvent(undefined)
          }}
          onSuccess={onUpdate}
        />
      )}

      {deletingEvent && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeletingEvent(null)}
          onConfirm={handleDelete}
          title="Hapus Event"
          message={`Apakah Anda yakin ingin menghapus event "${deletingEvent.title}"?`}
          confirmText="Hapus"
          loading={isDeleting}
        />
      )}
    </div>
  )
}
