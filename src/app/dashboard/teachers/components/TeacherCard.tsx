'use client'

import { GraduationCap, Mail, Phone, MapPin, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import { TeacherWithRelations } from '../actions'

interface TeacherCardProps {
  teacher: TeacherWithRelations
  onEdit: (teacher: TeacherWithRelations) => void
  onDelete: (teacher: TeacherWithRelations) => void
  onDetail: (teacher: TeacherWithRelations) => void
}

export default function TeacherCard({ teacher, onEdit, onDelete, onDetail }: TeacherCardProps) {
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
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
          teacher.gender === 'MALE' 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-pink-500 to-pink-600'
        }`}>
          <GraduationCap size={32} className="text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {teacher.user.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">NIP: {teacher.nip}</p>
          <p className="text-xs text-gray-500 mb-3">{getGenderLabel(teacher.gender)}</p>
          
          {/* Contact Info */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail size={14} />
              <span className="truncate">{teacher.user.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone size={14} />
              <span>{teacher.phone}</span>
            </div>
          </div>

          {/* Subjects */}
          {teacher.subjects.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Mata Pelajaran:</p>
              <div className="flex flex-wrap gap-1">
                {JSON.parse(teacher.subjects).map((subject: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Classes */}
          {teacher.classes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Kelas:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.classes.map((cls) => (
                  <span
                    key={cls.id}
                    className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                  >
                    {cls.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => onDetail(teacher)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <Eye size={14} />
              <span>Detail</span>
            </button>
            <button
              onClick={() => onEdit(teacher)}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(teacher)}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
