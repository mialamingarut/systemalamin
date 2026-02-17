'use client'

import { GraduationCap, Mail, Phone, MapPin, Calendar, Users, BookOpen, Edit, X } from 'lucide-react'
import { TeacherWithRelations } from '../actions'

interface TeacherDetailProps {
  teacher: TeacherWithRelations
  onEdit: () => void
  onClose: () => void
}

export default function TeacherDetail({ teacher, onEdit, onClose }: TeacherDetailProps) {
  const getGenderLabel = (gender: 'MALE' | 'FEMALE') => {
    return gender === 'MALE' ? 'Laki-laki' : 'Perempuan'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start space-x-4 pb-6 border-b">
        <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
          teacher.gender === 'MALE' 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-pink-500 to-pink-600'
        }`}>
          <GraduationCap size={40} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{teacher.user.name}</h2>
          <p className="text-gray-600 mt-1">NIP: {teacher.nip}</p>
          <p className="text-sm text-gray-500 mt-1">{getGenderLabel(teacher.gender)}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Mail size={20} />
          <span>Contact Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900">{teacher.user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900">{teacher.phone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-gray-900">{teacher.address}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar size={20} />
          <span>Personal Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-gray-900">{formatDate(teacher.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Join Date</p>
            <p className="text-gray-900">{formatDate(teacher.joinDate)}</p>
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen size={20} />
          <span>Subjects</span>
        </h3>
        {(Array.isArray(teacher.subjects) ? teacher.subjects : JSON.parse(teacher.subjects)).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(teacher.subjects) ? teacher.subjects : JSON.parse(teacher.subjects)).map((subject: string, index: number) => (
              <span
                key={index}
                className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No subjects assigned</p>
        )}
      </div>

      {/* Classes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users size={20} />
          <span>Classes</span>
        </h3>
        {teacher.classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teacher.classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <p className="font-medium text-gray-900">{cls.name}</p>
                <p className="text-sm text-gray-500">Grade {cls.grade}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No classes assigned</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <X size={16} />
          <span>Close</span>
        </button>
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Edit size={16} />
          <span>Edit Teacher</span>
        </button>
      </div>
    </div>
  )
}
