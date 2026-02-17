'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react'
import { StudentWithRelations, deleteStudent, getStudentById, getParents } from '../actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import StudentForm from './StudentForm'
import StudentDetail from './StudentDetail'

interface StudentListProps {
  initialStudents: StudentWithRelations[]
  totalCount: number
  currentPage: number
  totalPages: number
  classes: Array<{ id: string; name: string; grade: number }>
}

export default function StudentList({
  initialStudents,
  totalCount,
  currentPage,
  totalPages,
  classes,
}: StudentListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  
  const [students, setStudents] = useState(initialStudents)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedClass, setSelectedClass] = useState(searchParams.get('classId') || '')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentWithRelations | null>(null)
  const [parents, setParents] = useState<any[]>([])
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailStudent, setDetailStudent] = useState<any | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<StudentWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update students when initialStudents changes
  useEffect(() => {
    setStudents(initialStudents)
  }, [initialStudents])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      // Reset to page 1 when filters change
      if ('search' in updates || 'classId' in updates || 'status' in updates) {
        params.set('page', '1')
      }

      router.push(`/dashboard/students?${params.toString()}`)
    },
    [searchParams, router]
  )

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId)
    updateFilters({ classId })
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    updateFilters({ status })
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/dashboard/students?${params.toString()}`)
  }

  const handleEdit = async (student: StudentWithRelations) => {
    setEditingStudent(student)
    
    // Fetch parents for the form
    const parentsData = await getParents()
    setParents(parentsData)
    
    setIsEditModalOpen(true)
  }

  const handleDetail = async (student: StudentWithRelations) => {
    setIsLoadingDetail(true)
    setIsDetailModalOpen(true)
    
    try {
      // Fetch full student details including invoices
      const fullStudent = await getStudentById(student.id)
      if (fullStudent) {
        setDetailStudent(fullStudent)
      } else {
        toast.error('Failed to load student details')
        setIsDetailModalOpen(false)
      }
    } catch (error) {
      toast.error('An error occurred while loading student details')
      setIsDetailModalOpen(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleEditFromDetail = async () => {
    if (!detailStudent) return
    
    // Close detail modal
    setIsDetailModalOpen(false)
    
    // Fetch parents for the form
    const parentsData = await getParents()
    setParents(parentsData)
    
    // Open edit modal with the student data
    setEditingStudent(detailStudent)
    setIsEditModalOpen(true)
  }

  const handleDelete = (student: StudentWithRelations) => {
    setDeletingStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingStudent) return

    setIsDeleting(true)

    // Optimistic update - remove from list
    const previousStudents = students
    setStudents(students.filter(s => s.id !== deletingStudent.id))

    try {
      const result = await deleteStudent(deletingStudent.id)

      if (result.success) {
        toast.success('Student deleted successfully')
        setIsDeleteDialogOpen(false)
        setDeletingStudent(null)
        
        // Refresh the page to get updated data
        router.refresh()
      } else {
        // Revert optimistic update
        setStudents(previousStudents)
        toast.error(result.error || 'Failed to delete student')
      }
    } catch (error) {
      // Revert optimistic update
      setStudents(previousStudents)
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingStudent(null)
    toast.success('Student updated successfully')
    
    // Refresh the page to get updated data
    router.refresh()
  }

  const getGenderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Laki-laki' : 'Perempuan'
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Aktif
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
        Non-Aktif
      </span>
    )
  }

  const getClassDisplay = (student: StudentWithRelations) => {
    if (student.classStudents.length === 0) {
      return <span className="text-gray-400">-</span>
    }
    return student.classStudents[0].class.name
  }

  const startIndex = (currentPage - 1) * 20 + 1
  const endIndex = Math.min(currentPage * 20, totalCount)

  return (
    <>
      <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari siswa (nama, NIS, atau nama orang tua)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <select
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Semua Kelas</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Non-Aktif</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">NIS</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Jenis Kelamin</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Orang Tua</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <Users size={48} className="text-gray-300" />
                    <p className="text-lg font-medium">Tidak ada siswa ditemukan</p>
                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{student.nis}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            student.gender === 'MALE' ? 'bg-primary-100' : 'bg-pink-100'
                          }`}
                        >
                          <Users
                            size={20}
                            className={student.gender === 'MALE' ? 'text-primary-600' : 'text-pink-600'}
                          />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{getClassDisplay(student)}</td>
                  <td className="py-4 px-4 text-gray-600">{getGenderLabel(student.gender)}</td>
                  <td className="py-4 px-4 text-gray-600">{student.parent.user.name}</td>
                  <td className="py-4 px-4">{getStatusBadge(student.isActive)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleDetail(student)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                      >
                        <Eye size={16} />
                        <span>Detail</span>
                      </button>
                      <button 
                        onClick={() => handleEdit(student)}
                        className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(student)}
                        className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex}-{endIndex} dari {totalCount} siswa
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Edit Modal */}
    <Modal
      open={isEditModalOpen}
      onClose={() => {
        setIsEditModalOpen(false)
        setEditingStudent(null)
      }}
      title="Edit Student"
      size="xl"
    >
      {editingStudent && (
        <StudentForm
          mode="edit"
          initialData={editingStudent}
          parents={parents}
          onSuccess={handleEditSuccess}
          onCancel={() => {
            setIsEditModalOpen(false)
            setEditingStudent(null)
          }}
        />
      )}
    </Modal>

    {/* Detail Modal */}
    <Modal
      open={isDetailModalOpen}
      onClose={() => {
        setIsDetailModalOpen(false)
        setDetailStudent(null)
      }}
      title="Detail Siswa"
      size="xl"
    >
      {isLoadingDetail ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : detailStudent ? (
        <StudentDetail
          student={detailStudent}
          onEdit={handleEditFromDetail}
          onClose={() => {
            setIsDetailModalOpen(false)
            setDetailStudent(null)
          }}
        />
      ) : null}
    </Modal>

    {/* Delete Confirmation Dialog */}
    <ConfirmDialog
      open={isDeleteDialogOpen}
      onClose={() => {
        setIsDeleteDialogOpen(false)
        setDeletingStudent(null)
      }}
      onConfirm={confirmDelete}
      title="Delete Student"
      message={`Are you sure you want to delete ${deletingStudent?.name}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      loading={isDeleting}
    />
  </>
  )
}
