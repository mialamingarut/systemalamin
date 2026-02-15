import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keuangan</h1>
          <p className="text-gray-600 mt-1">Kelola pembayaran dan tagihan SPP</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:shadow-lg transition-all">
          Generate Tagihan
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Tagihan</span>
            <DollarSign className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">Rp 500rb</p>
          <p className="text-sm text-gray-500 mt-1">2 tagihan</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Sudah Dibayar</span>
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">Rp 0</p>
          <p className="text-sm text-gray-500 mt-1">0 pembayaran</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Belum Dibayar</span>
            <Clock className="text-amber-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">Rp 500rb</p>
          <p className="text-sm text-gray-500 mt-1">2 pending</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Tingkat Bayar</span>
            <TrendingUp className="text-primary-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">0%</p>
          <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tagihan Terbaru</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">No. Invoice</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Siswa</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Bulan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nominal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Jatuh Tempo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">INV-202607-0001</td>
                <td className="py-4 px-4 text-gray-900">Muhammad Rizki</td>
                <td className="py-4 px-4 text-gray-600">Juli 2026</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">Rp 250.000</td>
                <td className="py-4 px-4 text-gray-600">10 Jul 2026</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700">Bayar</button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">INV-202607-0002</td>
                <td className="py-4 px-4 text-gray-900">Fatimah Zahra</td>
                <td className="py-4 px-4 text-gray-600">Juli 2026</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">Rp 250.000</td>
                <td className="py-4 px-4 text-gray-600">10 Jul 2026</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-blue-600 hover:text-blue-700">Bayar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
