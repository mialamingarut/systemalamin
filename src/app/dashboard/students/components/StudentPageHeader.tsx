'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Download, Upload, ChevronDown } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import StudentForm from './StudentForm'
import { ImportDialog } from './ImportDialog'
import { useRouter } from 'next/navigation'

interface StudentPageHeaderProps {
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
  onExport: (format: 'excel' | 'pdf') => void
}

export default function StudentPageHeader({ parents, onExport }: StudentPageHeaderProps) {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // Close export menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false)
      }
    }

    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExportMenuOpen])

  const handleSuccess = () => {
    setIsCreateModalOpen(false)
    router.refresh()
  }

  const handleImportSuccess = () => {
    setIsImportDialogOpen(false)
    router.refresh()
  }

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsExportMenuOpen(false)
    onExport(format)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Siswa</h1>
          <p className="text-gray-600 mt-1">Kelola data siswa MI Al-Amin</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsImportDialogOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Import</span>
          </button>
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export</span>
              <ChevronDown size={16} />
            </button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export to Excel</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export to PDF</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Student"
        size="xl"
      >
        <StudentForm
          mode="create"
          parents={parents}
          onSuccess={handleSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <ImportDialog
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </>
  )
}
