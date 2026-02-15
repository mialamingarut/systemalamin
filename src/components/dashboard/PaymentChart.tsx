'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PaymentChart() {
  const data = [
    { month: 'Jan', amount: 85 },
    { month: 'Feb', amount: 92 },
    { month: 'Mar', amount: 88 },
    { month: 'Apr', amount: 95 },
    { month: 'Mei', amount: 90 },
    { month: 'Jun', amount: 98 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Pembayaran SPP</h3>
          <p className="text-sm text-gray-600 mt-1">Persentase pembayaran per bulan</p>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>2026</option>
          <option>2025</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="amount" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
