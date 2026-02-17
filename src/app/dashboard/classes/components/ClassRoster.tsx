'use client'

import { useState, useEffect, useTransition } from 'react'
import { Search, X, UserPlus } from 'lucide-react'
import { ClassWithRelations, getAvailableStudents, updateClassRoster } from '../actions'
import { useToast } from '@/components/ui/Toast'

interface ClassRosterProps {
  classData: ClassWithRelations
  onSuccess: () => void
  onCancel: () => void
}

export default function ClassRoster({ classData, onSuccess, onCancel }: ClassRosterProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()
  
  const [availableStudents, setAvailableStudents] = useState<any[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    classData.students.map(s => s.studentId)
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAvailableStudents()
  }, [])

  const loadAvailableStudents = async () => {
    setIsLoading(true)
    try {
      const students = await getAvailableStudents(classData.academicYearId, classData.id)
      setAvailableStudents(students)
    } catch (error) {
      toast.error('Failed to load available students')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = availableStudents.filter((student) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.nis.toLowerCase().includes(searchLower)
    )
  })

  const currentStudents = availableStudents.filter(s => selectedStudents.includes(s.id))
  const availableToAdd = filteredStudents.filter(s => !selectedStudents.includes(s.id))

  const handleAddStudent = (studentId: string) => {
    if (selectedStudents.length >= classData.capacity) {
      toast.error(`Cannot add more than ${classData.capacity} students`)
      return
    }
    setSelectedStudents([...selectedStudents, studentId])
  }

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter(id => id !== studentId))
  }

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        const result = await updateClassRoster(classData.id, selectedStudents)

        if (result.success) {
          toast.success('Class roster updated successfully')
          onSuccess()
        } else {
          toast.error(result.error || 'Failed to update class roster')
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Capacity Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Class Capacity</p>
            <p className="text-xs text-blue-700 mt-1">
              {selectedStudents.length} / {classData.capacity} students
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-900">{selectedStudents.length}</p>
            <p className="text-xs text-blue-700">Selected</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                (selectedStudents.length / classData.capacity) * 100 >= 90
                  ? 'bg-red-500'
                  : (selectedStudents.length / classData.capacity) * 100 >= 75
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min((selectedStudents.length / classData.capacity) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Students */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Current Students ({currentStudents.length})
          </h3>
          <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
            {currentStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">No students in this class</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {currentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.nis}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Available Students */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Students
          </h3>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>

          <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
            {availableToAdd.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">
                  {searchTerm ? 'No students found' : 'No available students'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {availableToAdd.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.nis}</p>
                    </div>
                    <button
                      onClick={() => handleAddStudent(student.id)}
                      disabled={selectedStudents.length >= classData.capacity}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isPending && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>Save Roster</span>
        </button>
      </div>
    </div>
  )
}
