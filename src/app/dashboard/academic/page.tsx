import { Calendar, Megaphone, Image, Plus } from 'lucide-react';

export default function AcademicPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Akademik</h1>
          <p className="text-gray-600 mt-1">Kelola kalender, pengumuman, dan kegiatan</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Calendar size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Kalender Akademik</h3>
          <p className="text-sm text-gray-600 mb-4">Kelola jadwal dan event sekolah</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Megaphone size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Pengumuman</h3>
          <p className="text-sm text-gray-600 mb-4">Buat dan kelola pengumuman</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <Image size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Kegiatan Sekolah</h3>
          <p className="text-sm text-gray-600 mb-4">Dokumentasi kegiatan dan foto</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pengumuman Terbaru</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
            <Plus size={20} />
            <span>Buat Pengumuman</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Pinned</span>
                  <span className="text-sm text-gray-500">2 hari yang lalu</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Pembukaan Tahun Ajaran Baru 2026/2027
                </h3>
                <p className="text-gray-600 text-sm">
                  Dengan penuh syukur, kami mengumumkan pembukaan tahun ajaran baru 2026/2027...
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm ml-4">Detail</button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Pinned</span>
                  <span className="text-sm text-gray-500">2 hari yang lalu</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Pendaftaran SPMB Gelombang 1
                </h3>
                <p className="text-gray-600 text-sm">
                  Pendaftaran siswa baru gelombang 1 telah dibuka...
                </p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm ml-4">Detail</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
