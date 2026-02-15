import { GraduationCap, Plus, Download } from 'lucide-react';

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Guru</h1>
          <p className="text-gray-600 mt-1">Kelola data guru MI Al-Amin</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
            <Plus size={20} />
            <span>Tambah Guru</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Cari guru..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">Ahmad Fauzi, S.Pd</h3>
                <p className="text-sm text-gray-600 mb-2">NIP: 198501012010011001</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">Matematika</span>
                  <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">IPA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700">Detail</button>
                  <button className="text-sm text-amber-600 hover:text-amber-700">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
