'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.
        </p>
        <div className="space-y-3">
          <Button onClick={reset} variant="primary" className="w-full">
            Coba Lagi
          </Button>
          <Button
            onClick={() => (window.location.href = '/dashboard')}
            variant="secondary"
            className="w-full"
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
