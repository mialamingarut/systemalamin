import { Users, Plus, Download, Upload } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Siswa</h1>
          <p className="text-gray-600 mt-1">Kelola data siswa MI Al-Amin</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload size={20} />
            <span>Import</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
            <Plus size={20} />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Cari siswa..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Semua Kelas</option>
              <option>Kelas 1</option>
              <option>Kelas 2</option>
              <option>Kelas 3</option>
              <option>Kelas 4</option>
              <option>Kelas 5</option>
              <option>Kelas 6</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Non-Aktif</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">NIS</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Jenis Kelamin</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Orang Tua</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-900">2026001</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-900">Muhammad Rizki</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">1A</td>
                <td className="py-4 px-4 text-gray-600">Laki-laki</td>
                <td className="py-4 px-4 text-gray-600">Budi Santoso</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Aktif
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">Detail</button>
                    <button className="text-amber-600 hover:text-amber-700">Edit</button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-900">2026002</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-pink-600" />
                    </div>
                    <span className="font-medium text-gray-900">Fatimah Zahra</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">1A</td>
                <td className="py-4 px-4 text-gray-600">Perempuan</td>
                <td className="py-4 px-4 text-gray-600">Budi Santoso</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Aktif
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">Detail</button>
                    <button className="text-amber-600 hover:text-amber-700">Edit</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">Menampilkan 1-2 dari 2 siswa</p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
