import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';

export default function SPMBPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SPMB - Pendaftaran Siswa Baru</h1>
          <p className="text-gray-600 mt-1">Kelola pendaftaran siswa baru</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
          <Download size={20} />
          <span>Export Data</span>
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Pendaftar</span>
            <FileText className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Terverifikasi</span>
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">1</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Lulus</span>
            <CheckCircle className="text-primary-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Tidak Lulus</span>
            <XCircle className="text-red-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Cari pendaftar..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Semua Status</option>
              <option>Registered</option>
              <option>Verified</option>
              <option>Tested</option>
              <option>Passed</option>
              <option>Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">No. Pendaftaran</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal Lahir</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Orang Tua</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">SPMB-2026-0001</td>
                <td className="py-4 px-4 text-gray-900">Ahmad Zaki</td>
                <td className="py-4 px-4 text-gray-600">10 Mar 2019</td>
                <td className="py-4 px-4 text-gray-600">Hasan Abdullah</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Registered
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700">Verifikasi</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">SPMB-2026-0002</td>
                <td className="py-4 px-4 text-gray-900">Aisyah Putri</td>
                <td className="py-4 px-4 text-gray-600">25 Jun 2019</td>
                <td className="py-4 px-4 text-gray-600">Ibrahim Malik</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Verified
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700">Input Nilai</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
