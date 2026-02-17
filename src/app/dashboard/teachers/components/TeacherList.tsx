'use client'

import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { TeacherWithRelations, deleteTeacher, getTeacherById } from '../actions'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import TeacherCard from './TeacherCard'
import TeacherForm from './TeacherForm'
import TeacherDetail from './TeacherDetail'

interface TeacherListProps {
  initialTeachers: TeacherWithRelations[]
}

export default function TeacherList({ initialTeachers }: TeacherListProps) {
  const router = useRouter()
  const toast = useToast()
  
  const [teachers, setTeachers] = useState(initialTeachers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTeachers, setFilteredTeachers] = useState(initialTeachers)
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherWithRelations | null>(null)
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailTeacher, setDetailTeacher] = useState<TeacherWithRelations | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update teachers when initialTeachers changes
  useEffect(() => {
    setTeachers(initialTeachers)
    setFilteredTeachers(initialTeachers)
  }, [initialTeachers])

  // Filter teachers based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTeachers(teachers)
      return
    }

    const filtered = teachers.filter((teacher) => {
      const searchLower = searchTerm.toLowerCase()
      const subjects = JSON.parse(teacher.subjects)
      return (
        teacher.user.name.toLowerCase().includes(searchLower) ||
        teacher.nip.toLowerCase().includes(searchLower) ||
        teacher.user.email.toLowerCase().includes(searchLower) ||
        subjects.some((subject: string) => subject.toLowerCase().includes(searchLower))
      )
    })

    setFilteredTeachers(filtered)
  }, [searchTerm, teachers])

  const handleEdit = (teacher: TeacherWithRelations) => {
    setEditingTeacher(teacher)
    setIsEditModalOpen(true)
  }

  const handleDetail = async (teacher: TeacherWithRelations) => {
    setIsLoadingDetail(true)
    setIsDetailModalOpen(true)
    
    try {
      const fullTeacher = await getTeacherById(teacher.id)
      if (fullTeacher) {
        setDetailTeacher(fullTeacher)
      } else {
        toast.error('Failed to load teacher details')
        setIsDetailModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occurred while loading teacher details')
      setIsDetailModalOpen(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleEditFromDetail = () => {
    if (!detailTeacher) return
    
    setIsDetailModalOpen(false)
    setEditingTeacher(detailTeacher)
    setIsEditModalOpen(true)
  }

  const handleDelete = (teacher: TeacherWithRelations) => {
    setDeletingTeacher(teacher)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingTeacher) return

    setIsDeleting(true)

    // Optimistic update
    const previousTeachers = teachers
    setTeachers(teachers.filter(t => t.id !== deletingTeacher.id))

    try {
      const result = await deleteTeacher(deletingTeacher.id)

      if (result.success) {
        toast.success('Teacher deleted successfully')
        setIsDeleteDialogOpen(false)
        setDeletingTeacher(null)
        router.refresh()
      } else {
        setTeachers(previousTeachers)
        toast.error(result.error || 'Failed to delete teacher')
      }
    } catch (error) {
      setTeachers(previousTeachers)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingTeacher(null)
    toast.success('Teacher updated successfully')
    router.refresh()
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari guru (nama, NIP, email, atau mata pelajaran)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Teacher Grid */}
        {filteredTeachers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-2">
              <Users size={48} className="text-gray-300" />
              <p className="text-lg font-medium">Tidak ada guru ditemukan</p>
              <p className="text-sm">
                {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Belum ada data guru'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDetail={handleDetail}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {searchTerm && (
          <p className="text-sm text-gray-600">
            Menampilkan {filteredTeachers.length} dari {teachers.length} guru
          </p>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTeacher(null)
        }}
        title="Edit Teacher"
        size="xl"
      >
        {editingTeacher && (
          <TeacherForm
            mode="edit"
            initialData={editingTeacher}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingTeacher(null)
            }}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setDetailTeacher(null)
        }}
        title="Detail Guru"
        size="xl"
      >
        {isLoadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : detailTeacher ? (
          <TeacherDetail
            teacher={detailTeacher}
            onEdit={handleEditFromDetail}
            onClose={() => {
              setIsDetailModalOpen(false)
              setDetailTeacher(null)
            }}
          />
        ) : null}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingTeacher(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete ${deletingTeacher?.user.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </>
  )
}
