'use client'

import { Users, GraduationCap, Edit, Trash2, UserPlus } from 'lucide-react'
import { ClassWithRelations } from '../actions'

interface ClassCardProps {
  classData: ClassWithRelations
  onEdit: (classData: ClassWithRelations) => void
  onDelete: (classData: ClassWithRelations) => void
  onManageRoster: (classData: ClassWithRelations) => void
}

export default function ClassCard({ classData, onEdit, onDelete, onManageRoster }: ClassCardProps) {
  const getGradeLabel = (grade: number) => {
    return `Kelas ${grade}`
  }

  const getCapacityColor = () => {
    const percentage = (classData._count.students / classData.capacity) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-amber-600'
    return 'text-green-600'
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{classData.name}</h3>
          <p className="text-sm text-gray-600">{getGradeLabel(classData.grade)}</p>
          <p className="text-xs text-gray-500 mt-1">{classData.academicYear.name}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <Users size={24} className="text-white" />
        </div>
      </div>

      {/* Teacher */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2 text-sm">
          <GraduationCap size={16} className="text-gray-400" />
          <span className="text-gray-600">Wali Kelas:</span>
          <span className="font-medium text-gray-900">{classData.teacher.user.name}</span>
        </div>
      </div>

      {/* Capacity */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Kapasitas</span>
          <span className={`font-semibold ${getCapacityColor()}`}>
            {classData._count.students} / {classData.capacity}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              (classData._count.students / classData.capacity) * 100 >= 90
                ? 'bg-red-500'
                : (classData._count.students / classData.capacity) * 100 >= 75
                ? 'bg-amber-500'
                : 'bg-green-500'
            }`}
            style={{
              width: `${Math.min((classData._count.students / classData.capacity) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onManageRoster(classData)}
          className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
        >
          <UserPlus size={14} />
          <span>Roster</span>
        </button>
        <button
          onClick={() => onEdit(classData)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-1"
        >
          <Edit size={14} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(classData)}
          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center space-x-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
