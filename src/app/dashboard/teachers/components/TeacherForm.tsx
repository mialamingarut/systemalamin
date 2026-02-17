'use client'

import { useState, useTransition } from 'react'
import { createTeacher, updateTeacher, TeacherWithRelations } from '../actions'
import { useToast } from '@/components/ui/Toast'

interface TeacherFormProps {
  mode: 'create' | 'edit'
  initialData?: TeacherWithRelations
  onSuccess: () => void
  onCancel: () => void
}

export default function TeacherForm({ mode, initialData, onSuccess, onCancel }: TeacherFormProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState({
    name: initialData?.user.name || '',
    email: initialData?.user.email || '',
    password: '',
    nip: initialData?.nip || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    dateOfBirth: initialData?.dateOfBirth 
      ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] 
      : '',
    gender: initialData?.gender || 'MALE' as 'MALE' | 'FEMALE',
    joinDate: initialData?.joinDate 
      ? new Date(initialData.joinDate).toISOString().split('T')[0] 
      : '',
    subjects: initialData?.subjects ? (Array.isArray(initialData.subjects) ? initialData.subjects.join(', ') : JSON.parse(initialData.subjects).join(', ')) : '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    
    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.nip.trim()) newErrors.nip = 'NIP is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required'

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
        data.append('email', formData.email)
        if (formData.password) data.append('password', formData.password)
        data.append('nip', formData.nip)
        data.append('phone', formData.phone)
        data.append('address', formData.address)
        data.append('dateOfBirth', formData.dateOfBirth)
        data.append('gender', formData.gender)
        data.append('joinDate', formData.joinDate)
        data.append('subjects', formData.subjects)

        const result = mode === 'create'
          ? await createTeacher(data)
          : await updateTeacher(initialData!.id, data)

        if (result.success) {
          toast.success(`Teacher ${mode === 'create' ? 'created' : 'updated'} successfully`)
          onSuccess()
        } else {
          toast.error(result.error || `Failed to ${mode} teacher`)
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Ahmad Fauzi, S.Pd"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="teacher@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Minimum 6 characters"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        )}

        {/* NIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIP <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.nip ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 198501012010011001"
          />
          {errors.nip && <p className="text-red-500 text-sm mt-1">{errors.nip}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 081234567890"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        {/* Join Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Join Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.joinDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.joinDate && <p className="text-red-500 text-sm mt-1">{errors.joinDate}</p>}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full address"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subjects (comma separated)
        </label>
        <input
          type="text"
          name="subjects"
          value={formData.subjects}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Matematika, IPA, Bahasa Indonesia"
        />
        <p className="text-sm text-gray-500 mt-1">
          Separate multiple subjects with commas
        </p>
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
          <span>{mode === 'create' ? 'Create Teacher' : 'Update Teacher'}</span>
        </button>
      </div>
    </form>
  )
}
