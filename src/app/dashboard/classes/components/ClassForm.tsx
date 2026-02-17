'use client'

import { useState, useTransition } from 'react'
import { createClass, updateClass, ClassWithRelations } from '../actions'
import { useToast } from '@/components/ui/Toast'

interface ClassFormProps {
  mode: 'create' | 'edit'
  initialData?: ClassWithRelations
  teachers: Array<{
    id: string
    nip: string
    user: {
      id: string
      name: string
    }
  }>
  onSuccess: () => void
  onCancel: () => void
}

export default function ClassForm({ mode, initialData, teachers, onSuccess, onCancel }: ClassFormProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    grade: initialData?.grade || 1,
    teacherId: initialData?.teacherId || '',
    capacity: initialData?.capacity || 30,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'grade' || name === 'capacity' ? parseInt(value) : value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Class name is required'
    if (!formData.grade || formData.grade < 1 || formData.grade > 6) {
      newErrors.grade = 'Grade must be between 1 and 6'
    }
    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required'
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please fix the errors in the form')
      return
    }

    startTransition(async () => {
      try {
        const data = new FormData()
        data.append('name', formData.name)
        data.append('grade', formData.grade.toString())
        data.append('teacherId', formData.teacherId)
        data.append('capacity', formData.capacity.toString())

        const result = mode === 'create'
          ? await createClass(data)
          : await updateClass(initialData!.id, data)

        if (result.success) {
          toast.success(`Class ${mode === 'create' ? 'created' : 'updated'} successfully`)
          onSuccess()
        } else {
          toast.error(result.error || `Failed to ${mode} class`)
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 1A, 2B"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade <span className="text-red-500">*</span>
          </label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.grade ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Grade</option>
            {[1, 2, 3, 4, 5, 6].map((grade) => (
              <option key={grade} value={grade}>
                Kelas {grade}
              </option>
            ))}
          </select>
          {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
        </div>

        {/* Teacher */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wali Kelas <span className="text-red-500">*</span>
          </label>
          <select
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.teacherId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.name} ({teacher.nip})
              </option>
            ))}
          </select>
          {errors.teacherId && <p className="text-red-500 text-sm mt-1">{errors.teacherId}</p>}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.capacity ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 30"
          />
          {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
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
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isPending && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{mode === 'create' ? 'Create Class' : 'Update Class'}</span>
        </button>
      </div>
    </form>
  )
}
