'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createUser, updateUser } from '../actions'
import type { UserWithRelations } from '../actions'

interface UserFormProps {
  user?: UserWithRelations
  onClose: () => void
  onSuccess?: () => void
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const [email, setEmail] = useState(user?.email || '')
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'>(user?.role || 'TEACHER')
  const [isActive, setIsActive] = useState(user?.isActive ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !name.trim()) {
      toast.error('Email dan nama harus diisi')
      return
    }

    if (!user && !password.trim()) {
      toast.error('Password harus diisi untuk user baru')
      return
    }

    setIsLoading(true)
    try {
      const result = user
        ? await updateUser(user.id, {
            email,
            name,
            role,
            isActive,
          })
        : await createUser({
            email,
            name,
            password,
            role,
          })

      if (result.success) {
        toast.success(user ? 'User berhasil diupdate' : 'User berhasil dibuat')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'Gagal menyimpan user')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {user ? 'Edit User' : 'Tambah User Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
              <option value="PARENT">Parent</option>
            </select>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                User aktif
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              className="flex-1"
            >
              {user ? 'Update' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
