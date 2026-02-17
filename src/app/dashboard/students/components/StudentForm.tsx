'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { createStudent, updateStudent, StudentWithRelations } from '../actions'
import { Upload, X } from 'lucide-react'

interface StudentFormProps {
  mode: 'create' | 'edit'
  initialData?: StudentWithRelations
  parents: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
    fatherName: string
    motherName: string
  }>
  onSuccess: () => void
  onCancel: () => void
}

export default function StudentForm({
  mode,
  initialData,
  parents,
  onSuccess,
  onCancel,
}: StudentFormProps) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoPreview(null)
    const fileInput = document.getElementById('photo') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    
    // Add photo URL if preview exists
    if (photoPreview) {
      formData.set('photo', photoPreview)
    }

    startTransition(async () => {
      try {
        const result = mode === 'create' 
          ? await createStudent(formData)
          : await updateStudent(initialData!.id, formData)

        if (result.success) {
          toast.success(`Student ${mode === 'create' ? 'created' : 'updated'} successfully`)
          onSuccess()
        } else {
          if (result.fieldErrors) {
            setErrors(result.fieldErrors)
          }
          toast.error(result.error || `Failed to ${mode} student`)
        }
      } catch (error) {
        console.error('Form submission error:', error)
        toast.error('An unexpected error occurred')
      }
    })
  }

  const getFieldError = (field: string) => {
    return errors[field]?.[0]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NIS */}
        <div>
          <label htmlFor="nis" className="block text-sm font-medium text-gray-700 mb-1.5">
            NIS <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nis"
            name="nis"
            defaultValue={initialData?.nis}
            required
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('nis') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter student NIS"
          />
          {getFieldError('nis') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('nis')}</p>
          )}
        </div>

        {/* NISN */}
        <div>
          <label htmlFor="nisn" className="block text-sm font-medium text-gray-700 mb-1.5">
            NISN
          </label>
          <input
            type="text"
            id="nisn"
            name="nisn"
            defaultValue={initialData?.nisn || ''}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('nisn') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter student NISN (optional)"
          />
          {getFieldError('nisn') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('nisn')}</p>
          )}
        </div>

        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={initialData?.name}
            required
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('name') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter student full name"
          />
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <Select
            label="Gender"
            name="gender"
            required
            defaultValue={initialData?.gender}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
            ]}
            placeholder="Select gender"
            error={getFieldError('gender')}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1.5">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            defaultValue={initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : ''}
            required
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('dateOfBirth') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('dateOfBirth') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('dateOfBirth')}</p>
          )}
        </div>

        {/* Place of Birth */}
        <div>
          <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-1.5">
            Place of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="placeOfBirth"
            name="placeOfBirth"
            defaultValue={initialData?.placeOfBirth}
            required
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('placeOfBirth') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter place of birth"
          />
          {getFieldError('placeOfBirth') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('placeOfBirth')}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={initialData?.phone || ''}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('phone') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter phone number (optional)"
          />
          {getFieldError('phone') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            defaultValue={initialData?.address}
            required
            rows={3}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('address') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter full address"
          />
          {getFieldError('address') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
          )}
        </div>

        {/* Parent Selection */}
        <div className="md:col-span-2">
          <Select
            label="Parent"
            name="parentId"
            required
            defaultValue={initialData?.parentId}
            options={parents.map((parent) => ({
              value: parent.id,
              label: `${parent.user.name} (Father: ${parent.fatherName}, Mother: ${parent.motherName})`,
            }))}
            placeholder="Select parent"
            error={getFieldError('parentId')}
          />
        </div>

        {/* Enrollment Date */}
        <div>
          <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            Enrollment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="enrollmentDate"
            name="enrollmentDate"
            defaultValue={initialData?.enrollmentDate ? new Date(initialData.enrollmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
            required
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              getFieldError('enrollmentDate') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('enrollmentDate') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('enrollmentDate')}</p>
          )}
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Photo
          </label>
          <div className="flex items-start space-x-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <Upload className="text-gray-400" size={32} />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Choose Photo
              </label>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, JPEG up to 5MB
              </p>
            </div>
          </div>
          {getFieldError('photo') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('photo')}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isPending}
          disabled={isPending}
        >
          {mode === 'create' ? 'Create Student' : 'Update Student'}
        </Button>
      </div>
    </form>
  )
}
