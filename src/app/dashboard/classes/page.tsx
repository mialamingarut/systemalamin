import { BookOpen, Plus, Users } from 'lucide-react';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Kelas</h1>
          <p className="text-gray-600 mt-1">Kelola kelas dan siswa</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
          <Plus size={20} />
          <span>Tambah Kelas</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Aktif
            </span>
          </div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Kelas 1A</h3>
          <p className="text-sm text-gray-600 mb-4">Wali Kelas: Ahmad Fauzi, S.Pd</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users size={16} />
              <span>2 / 30 siswa</span>
            </div>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Detail →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
