'use client'

import { useState } from 'react'
import { Settings, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { updateSystemConfig } from '../actions'
import type { SystemConfigItem } from '../actions'

interface ConfigEditorProps {
  configs: SystemConfigItem[]
  onUpdate?: () => void
}

export function ConfigEditor({ configs, onUpdate }: ConfigEditorProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleEdit = (config: SystemConfigItem) => {
    setEditingKey(config.key)
    setEditValue(config.value)
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditValue('')
  }

  const handleSave = async (key: string) => {
    if (!editValue.trim()) {
      toast.error('Nilai tidak boleh kosong')
      return
    }

    setIsLoading(true)
    const result = await updateSystemConfig(key, editValue)
    setIsLoading(false)

    if (result.success) {
      toast.success('Konfigurasi berhasil diupdate')
      setEditingKey(null)
      setEditValue('')
      onUpdate?.()
    } else {
      toast.error(result.error || 'Gagal mengupdate konfigurasi')
    }
  }

  // Group configs by key prefix (e.g., school_, financial_)
  const groupedConfigs = configs.reduce((acc, config) => {
    const prefix = config.key.includes('_') ? config.key.split('_')[0] : 'general'
    if (!acc[prefix]) {
      acc[prefix] = []
    }
    acc[prefix].push(config)
    return acc
  }, {} as Record<string, SystemConfigItem[]>)

  const categoryLabels: Record<string, string> = {
    school: 'Informasi Sekolah',
    social: 'Media Sosial',
    spp: 'Konfigurasi Keuangan',
    financial: 'Konfigurasi Keuangan',
    general: 'Umum',
  }

  const formatKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Konfigurasi Sistem</h2>
      </div>

      {Object.keys(groupedConfigs).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Belum ada konfigurasi</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedConfigs).map(([category, categoryConfigs]) => (
            <div key={category} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-3">
                {categoryConfigs.map((config) => (
                  <div
                    key={config.key}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{formatKey(config.key)}</p>
                      {config.description && (
                        <p className="text-xs text-gray-500 mt-1">{config.description}</p>
                      )}
                      {editingKey === config.key ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm text-gray-600 mt-1">{config.value}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {editingKey === config.key ? (
                        <>
                          <button
                            onClick={() => handleSave(config.key)}
                            disabled={isLoading}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
