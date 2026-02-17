'use client'

import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { ClassWithRelations, deleteClass } from '../actions'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import ClassCard from './ClassCard'
import ClassForm from './ClassForm'
import ClassRoster from './ClassRoster'

interface ClassListProps {
  initialClasses: ClassWithRelations[]
  teachers: Array<{
    id: string
    nip: string
    user: {
      id: string
      name: string
    }
  }>
}

export default function ClassList({ initialClasses, teachers }: ClassListProps) {
  const router = useRouter()
  const toast = useToast()
  
  const [classes, setClasses] = useState(initialClasses)
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [filteredClasses, setFilteredClasses] = useState(initialClasses)
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassWithRelations | null>(null)
  
  // Roster modal state
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false)
  const [rosterClass, setRosterClass] = useState<ClassWithRelations | null>(null)
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingClass, setDeletingClass] = useState<ClassWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update classes when initialClasses changes
  useEffect(() => {
    setClasses(initialClasses)
    setFilteredClasses(initialClasses)
  }, [initialClasses])

  // Filter classes by grade
  useEffect(() => {
    if (selectedGrade === null) {
      setFilteredClasses(classes)
      return
    }

    const filtered = classes.filter((cls) => cls.grade === selectedGrade)
    setFilteredClasses(filtered)
  }, [selectedGrade, classes])

  // Get unique grades
  const grades = Array.from(new Set(classes.map((cls) => cls.grade))).sort()

  const handleEdit = (classData: ClassWithRelations) => {
    setEditingClass(classData)
    setIsEditModalOpen(true)
  }

  const handleManageRoster = (classData: ClassWithRelations) => {
    setRosterClass(classData)
    setIsRosterModalOpen(true)
  }

  const handleDelete = (classData: ClassWithRelations) => {
    setDeletingClass(classData)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingClass) return

    setIsDeleting(true)

    // Optimistic update
    const previousClasses = classes
    setClasses(classes.filter(c => c.id !== deletingClass.id))

    try {
      const result = await deleteClass(deletingClass.id)

      if (result.success) {
        toast.success('Class deleted successfully')
        setIsDeleteDialogOpen(false)
        setDeletingClass(null)
        router.refresh()
      } else {
        setClasses(previousClasses)
        toast.error(result.error || 'Failed to delete class')
      }
    } catch (error) {
      setClasses(previousClasses)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingClass(null)
    toast.success('Class updated successfully')
    router.refresh()
  }

  const handleRosterSuccess = () => {
    setIsRosterModalOpen(false)
    setRosterClass(null)
    toast.success('Class roster updated successfully')
    router.refresh()
  }

  return (
    <>
      <div className="space-y-6">
        {/* Grade Filter */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedGrade(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedGrade === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua Kelas
          </button>
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedGrade === grade
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kelas {grade}
            </button>
          ))}
        </div>

        {/* Class Grid */}
        {filteredClasses.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-2">
              <Users size={48} className="text-gray-300" />
              <p className="text-lg font-medium">Tidak ada kelas ditemukan</p>
              <p className="text-sm">
                {selectedGrade !== null
                  ? `Tidak ada kelas untuk tingkat ${selectedGrade}`
                  : 'Belum ada data kelas'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageRoster={handleManageRoster}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {selectedGrade !== null && (
          <p className="text-sm text-gray-600">
            Menampilkan {filteredClasses.length} dari {classes.length} kelas
          </p>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingClass(null)
        }}
        title="Edit Class"
        size="lg"
      >
        {editingClass && (
          <ClassForm
            mode="edit"
            initialData={editingClass}
            teachers={teachers}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingClass(null)
            }}
          />
        )}
      </Modal>

      {/* Roster Modal */}
      <Modal
        open={isRosterModalOpen}
        onClose={() => {
          setIsRosterModalOpen(false)
          setRosterClass(null)
        }}
        title="Manage Class Roster"
        size="xl"
      >
        {rosterClass && (
          <ClassRoster
            classData={rosterClass}
            onSuccess={handleRosterSuccess}
            onCancel={() => {
              setIsRosterModalOpen(false)
              setRosterClass(null)
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingClass(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${deletingClass?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </>
  )
}
