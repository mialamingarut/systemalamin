'use client'

import { useState, useEffect } from 'react'
import { Settings, School, DollarSign, Users, Shield, Calendar } from 'lucide-react'
import { AcademicYearManager } from './AcademicYearManager'
import { ConfigEditor } from './ConfigEditor'
import { UserList } from './UserList'
import { ActivityLogViewer } from './ActivityLogViewer'
import { getAcademicYears, getSystemConfigs, getUsers } from '../actions'
import type { AcademicYearWithRelations, SystemConfigItem, UserWithRelations } from '../actions'

type ViewMode = 'overview' | 'academic-years' | 'config' | 'users' | 'logs'

export function SettingsPageWrapper() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [academicYears, setAcademicYears] = useState<AcademicYearWithRelations[]>([])
  const [configs, setConfigs] = useState<SystemConfigItem[]>([])
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [yearsData, configsData, usersData] = await Promise.all([
        getAcademicYears(),
        getSystemConfigs(),
        getUsers(),
      ])

      setAcademicYears(yearsData)
      setConfigs(configsData)
      setUsers(usersData)
    } catch (error) {
      console.error('Failed to load settings data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (viewMode === 'academic-years') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <AcademicYearManager years={academicYears} onUpdate={loadData} />
      </div>
    )
  }

  if (viewMode === 'config') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <ConfigEditor configs={configs} onUpdate={loadData} />
      </div>
    )
  }

  if (viewMode === 'users') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <UserList users={users} onUpdate={loadData} />
      </div>
    )
  }

  if (viewMode === 'logs') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <ActivityLogViewer />
      </div>
    )
  }

  // Overview mode
  const schoolConfigs = configs.filter(c => c.key.startsWith('school_'))
  const financialConfigs = configs.filter(c => c.key.startsWith('spp_') || c.key.startsWith('financial_'))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-1">Kelola pengaturan sistem</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => setViewMode('academic-years')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
            <Calendar size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Tahun Ajaran</h3>
          <p className="text-sm text-gray-600 mb-4">Kelola tahun ajaran akademik</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {academicYears.length} tahun ajaran →
          </div>
        </button>

        <button
          onClick={() => setViewMode('config')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <School size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Konfigurasi Sistem</h3>
          <p className="text-sm text-gray-600 mb-4">Informasi sekolah dan keuangan</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {configs.length} konfigurasi →
          </div>
        </button>

        <button
          onClick={() => setViewMode('users')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Manajemen User</h3>
          <p className="text-sm text-gray-600 mb-4">Kelola akun pengguna sistem</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {users.length} user →
          </div>
        </button>

        <button
          onClick={() => setViewMode('logs')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Activity Log</h3>
          <p className="text-sm text-gray-600 mb-4">Riwayat aktivitas sistem</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Lihat log →
          </div>
        </button>
      </div>

      {/* Quick Config View */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Konfigurasi Cepat</h2>
        <div className="space-y-4">
          {schoolConfigs.slice(0, 3).map((config) => (
            <div key={config.key} className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">
                  {config.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className="text-sm text-gray-600">{config.value}</p>
              </div>
              <button
                onClick={() => setViewMode('config')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
            </div>
          ))}
          {financialConfigs.slice(0, 2).map((config) => (
            <div key={config.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
              <div>
                <p className="font-medium text-gray-900">
                  {config.key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className="text-sm text-gray-600">{config.value}</p>
              </div>
              <button
                onClick={() => setViewMode('config')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
