'use client'

import { useState } from 'react'
import { Users, Edit, Trash2, Plus, Key, CheckCircle, XCircle } from 'lucide-react'
import { UserForm } from './UserForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { deleteUser, resetUserPassword } from '../actions'
import type { UserWithRelations } from '../actions'

interface UserListProps {
  users: UserWithRelations[]
  onUpdate?: () => void
}

export function UserList({ users, onUpdate }: UserListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithRelations | undefined>()
  const [deletingUser, setDeletingUser] = useState<UserWithRelations | null>(null)
  const [resettingPassword, setResettingPassword] = useState<UserWithRelations | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const toast = useToast()

  const handleDelete = async () => {
    if (!deletingUser) return

    setIsDeleting(true)
    const result = await deleteUser(deletingUser.id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('User berhasil dihapus')
      setDeletingUser(null)
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal menghapus user')
    }
  }

  const handleResetPassword = async () => {
    if (!resettingPassword || !newPassword.trim()) {
      toast.error('Password baru harus diisi')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setIsResetting(true)
    const result = await resetUserPassword(resettingPassword.id, newPassword)
    setIsResetting(false)

    if (result.success) {
      toast.success('Password berhasil direset')
      setResettingPassword(null)
      setNewPassword('')
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal reset password')
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-700',
      TEACHER: 'bg-blue-100 text-blue-700',
      STUDENT: 'bg-green-100 text-green-700',
      PARENT: 'bg-amber-100 text-amber-700',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[role as keyof typeof styles]}`}>
        {role}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen User</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Tambah User
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada user</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Tambah User Pertama
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                    <td className="py-4 px-4 text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-4">
                      {user.isActive ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <XCircle size={16} />
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowForm(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setResettingPassword(user)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowForm(false)
            setEditingUser(undefined)
          }}
          onSuccess={onUpdate}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          open={true}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          title="Hapus User"
          message={`Apakah Anda yakin ingin menghapus user "${deletingUser.name}"?`}
          confirmText="Hapus"
          loading={isDeleting}
        />
      )}

      {resettingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset Password</h2>
            <p className="text-gray-600 mb-4">
              Reset password untuk user: <strong>{resettingPassword.name}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setResettingPassword(null)
                  setNewPassword('')
                }}
                disabled={isResetting}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={isResetting}
                loading={isResetting}
                className="flex-1"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
