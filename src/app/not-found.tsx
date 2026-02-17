import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl font-bold text-primary-600 mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <Link href="/">
          <Button variant="primary" className="w-full">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  )
}
