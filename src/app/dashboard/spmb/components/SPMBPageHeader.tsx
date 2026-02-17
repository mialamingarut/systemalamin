'use client'

import { FileText, Download } from 'lucide-react'

interface SPMBStats {
  total: number
  registered: number
  verified: number
  tested: number
  passed: number
  failed: number
}

interface SPMBPageHeaderProps {
  stats: SPMBStats
}

export default function SPMBPageHeader({ stats }: SPMBPageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SPMB - Pendaftaran Siswa Baru</h1>
          <p className="text-gray-600 mt-1">Kelola pendaftaran siswa baru</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total</span>
            <FileText className="text-gray-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Terdaftar</span>
            <FileText className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.registered}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Terverifikasi</span>
            <FileText className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sudah Tes</span>
            <FileText className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.tested}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Lulus</span>
            <FileText className="text-primary-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-primary-600">{stats.passed}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Tidak Lulus</span>
            <FileText className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>
    </div>
  )
}
