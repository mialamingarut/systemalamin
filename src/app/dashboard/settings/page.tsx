import { Settings, School, DollarSign, Users, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-1">Kelola pengaturan sistem</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <School size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Informasi Sekolah</h3>
          <p className="text-sm text-gray-600 mb-4">Nama, alamat, kontak sekolah</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
            <DollarSign size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Konfigurasi Keuangan</h3>
          <p className="text-sm text-gray-600 mb-4">Nominal SPP, metode pembayaran</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <Users size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Manajemen User</h3>
          <p className="text-sm text-gray-600 mb-4">Kelola akun pengguna sistem</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Keamanan</h3>
          <p className="text-sm text-gray-600 mb-4">Password, backup, activity log</p>
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Kelola →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Konfigurasi Sistem</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Nama Sekolah</p>
              <p className="text-sm text-gray-600">Madrasah Ibtidaiyah Al-Amin</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Alamat</p>
              <p className="text-sm text-gray-600">Jl. Pendidikan No. 123, Jakarta Selatan</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Telepon</p>
              <p className="text-sm text-gray-600">0812-3456-7890</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">info@mialamin.sch.id</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Nominal SPP</p>
              <p className="text-sm text-gray-600">Rp 250.000 / bulan</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
