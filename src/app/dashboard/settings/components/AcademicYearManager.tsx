'use client'

import { useState } from 'react'
import { Calendar, Edit, Trash2, Plus, CheckCircle } from 'lucide-react'
import { AcademicYearForm } from './AcademicYearForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { deleteAcademicYear } from '../actions'
import type { AcademicYearWithRelations } from '../actions'

interface AcademicYearManagerProps {
  years: AcademicYearWithRelations[]
  onUpdate?: () => void
}

export function AcademicYearManager({ years, onUpdate }: AcademicYearManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYearWithRelations | undefined>()
  const [deletingYear, setDeletingYear] = useState<AcademicYearWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    if (!deletingYear) return

    setIsDeleting(true)
    const result = await deleteAcademicYear(deletingYear.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Tahun ajaran berhasil dihapus')
      setDeletingYear(null)
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal menghapus tahun ajaran')
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
        <h2 className="text-2xl font-bold text-gray-900">Tahun Ajaran</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Tambah Tahun Ajaran
        </Button>
      </div>

      {years.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada tahun ajaran</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Tambah Tahun Ajaran Pertama
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {years.map((year) => (
            <div
              key={year.id}
              className={`bg-white border-2 rounded-xl p-6 ${
                year.isActive ? 'border-primary-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{year.name}</h3>
                    {year.isActive && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(year.startDate)} - {formatDate(year.endDate)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingYear(year)
                      setShowForm(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingYear(year)}
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
        <AcademicYearForm
          year={editingYear}
          onClose={() => {
            setShowForm(false)
            setEditingYear(undefined)
          }}
          onSuccess={onUpdate}
        />
      )}

      {deletingYear && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeletingYear(null)}
          onConfirm={handleDelete}
          title="Hapus Tahun Ajaran"
          message={`Apakah Anda yakin ingin menghapus tahun ajaran "${deletingYear.name}"?`}
          confirmText="Hapus"
          loading={isDeleting}
        />
      )}
    </div>
  )
}
