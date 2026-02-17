'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { getActivityLogs, exportActivityLogs } from '../actions'
import { exportToCSV } from '@/lib/exports'
import type { ActivityLogWithRelations } from '../actions'

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLogWithRelations[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  
  // Filters
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const toast = useToast()
  const limit = 50

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const result = await getActivityLogs({
        action: actionFilter || undefined,
        entity: entityFilter || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        page,
        limit,
      })

      setLogs(result.logs)
      setTotal(result.total)
    } catch (error) {
      toast.error('Gagal memuat activity log')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [page, actionFilter, entityFilter, startDate, endDate])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportLogs = await exportActivityLogs({
        action: actionFilter || undefined,
        entity: entityFilter || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      })

      const data = exportLogs.map(log => ({
        timestamp: new Date(log.createdAt).toLocaleString('id-ID'),
        user: log.user?.name || 'System',
        email: log.user?.email || '-',
        action: log.action,
        entity: log.entity,
        entityId: log.entityId || '-',
        details: log.details || '-',
        ipAddress: log.ipAddress || '-',
      }))

      const columns = [
        { key: 'timestamp' as const, header: 'Timestamp' },
        { key: 'user' as const, header: 'User' },
        { key: 'email' as const, header: 'Email' },
        { key: 'action' as const, header: 'Action' },
        { key: 'entity' as const, header: 'Entity' },
        { key: 'entityId' as const, header: 'Entity ID' },
        { key: 'details' as const, header: 'Details' },
        { key: 'ipAddress' as const, header: 'IP Address' },
      ]

      exportToCSV(data, columns, 'activity-logs')
      toast.success('Activity log berhasil diekspor')
    } catch (error) {
      toast.error('Gagal mengekspor activity log')
    } finally {
      setIsExporting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActionBadge = (action: string) => {
    const styles = {
      CREATE: 'bg-green-100 text-green-700',
      UPDATE: 'bg-blue-100 text-blue-700',
      DELETE: 'bg-red-100 text-red-700',
      LOGIN: 'bg-purple-100 text-purple-700',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[action as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {action}
      </span>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <Button onClick={handleExport} disabled={isExporting} variant="secondary">
          <Download size={20} className="mr-2" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Semua</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
            <input
              type="text"
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value)
                setPage(1)
              }}
              placeholder="Contoh: Student"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
              min={startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {isLoading ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 mt-2">Memuat data...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Tidak ada activity log</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Entity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Details</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">
                        {log.user?.name || 'System'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.user?.email || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{log.entity}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total} log
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
