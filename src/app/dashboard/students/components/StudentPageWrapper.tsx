'use client'

import { useState } from 'react'
import StudentPageHeader from './StudentPageHeader'
import StudentList from './StudentList'
import { StudentWithRelations } from '../actions'
import { exportToExcel, exportToPDF } from '@/lib/exports'
import { useToast } from '@/components/ui/Toast'

interface StudentPageWrapperProps {
  initialStudents: StudentWithRelations[]
  totalCount: number
  currentPage: number
  totalPages: number
  classes: Array<{ id: string; name: string; grade: number }>
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
  allStudents: StudentWithRelations[]
}

export default function StudentPageWrapper({
  initialStudents,
  totalCount,
  currentPage,
  totalPages,
  classes,
  parents,
  allStudents,
}: StudentPageWrapperProps) {
  const toast = useToast()

  const handleExport = (format: 'excel' | 'pdf') => {
    try {
      // Prepare data for export
      const exportData = allStudents.map((student) => ({
        NIS: student.nis,
        Nama: student.name,
        'Jenis Kelamin': student.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
        'Tempat Lahir': student.placeOfBirth,
        'Tanggal Lahir': new Date(student.dateOfBirth).toLocaleDateString('id-ID'),
        Alamat: student.address,
        'Nama Ayah': student.parent.fatherName,
        'Nama Ibu': student.parent.motherName,
        'Nama Wali': student.parent.user.name,
        'Email Wali': student.parent.user.email,
        Telepon: student.parent.phone || '-',
        Kelas: student.classStudents.length > 0 ? student.classStudents[0].class.name : '-',
        Status: student.isActive ? 'Aktif' : 'Non-Aktif',
      }))

      const columns = [
        { key: 'NIS' as const, header: 'NIS' },
        { key: 'Nama' as const, header: 'Nama' },
        { key: 'Jenis Kelamin' as const, header: 'Jenis Kelamin' },
        { key: 'Tempat Lahir' as const, header: 'Tempat Lahir' },
        { key: 'Tanggal Lahir' as const, header: 'Tanggal Lahir' },
        { key: 'Alamat' as const, header: 'Alamat' },
        { key: 'Nama Ayah' as const, header: 'Nama Ayah' },
        { key: 'Nama Ibu' as const, header: 'Nama Ibu' },
        { key: 'Nama Wali' as const, header: 'Nama Wali' },
        { key: 'Email Wali' as const, header: 'Email Wali' },
        { key: 'Telepon' as const, header: 'Telepon' },
        { key: 'Kelas' as const, header: 'Kelas' },
        { key: 'Status' as const, header: 'Status' },
      ]

      if (format === 'excel') {
        exportToExcel(exportData, columns, 'data-siswa')
        toast.success('Data berhasil diekspor ke Excel')
      } else {
        exportToPDF(exportData, columns, 'data-siswa', 'Data Siswa MI Al-Amin')
        toast.success('Data berhasil diekspor ke PDF')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Gagal mengekspor data')
    }
  }

  return (
    <div className="space-y-6">
      <StudentPageHeader parents={parents} onExport={handleExport} />

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <StudentList
          initialStudents={initialStudents}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          classes={classes}
        />
      </div>
    </div>
  )
}
