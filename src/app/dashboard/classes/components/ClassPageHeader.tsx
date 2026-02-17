'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import ClassForm from './ClassForm'
import { useRouter } from 'next/navigation'

interface ClassPageHeaderProps {
  teachers: Array<{
    id: string
    nip: string
    user: {
      id: string
      name: string
    }
  }>
}

export default function ClassPageHeader({ teachers }: ClassPageHeaderProps) {
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
          <h1 className="text-3xl font-bold text-gray-900">Data Kelas</h1>
          <p className="text-gray-600 mt-1">Kelola data kelas MI Al-Amin</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Tambah Kelas</span>
          </button>
        </div>
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Class"
        size="lg"
      >
        <ClassForm
          mode="create"
          teachers={teachers}
          onSuccess={handleSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </>
  )
}
