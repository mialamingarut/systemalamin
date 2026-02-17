'use client'

import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import TeacherForm from './TeacherForm'
import { useRouter } from 'next/navigation'

export default function TeacherPageHeader() {
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleSuccess = () => {
    setIsCreateModalOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Guru</h1>
          <p className="text-gray-600 mt-1">Kelola data guru MI Al-Amin</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Tambah Guru</span>
          </button>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Teacher"
        size="xl"
      >
        <TeacherForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </>
  )
}
