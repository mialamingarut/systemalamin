'use client';

import { Bell, Search, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari siswa, guru, atau data lainnya..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Pembayaran SPP Baru</p>
                    <p className="text-xs text-gray-500 mt-1">Muhammad Rizki telah melakukan pembayaran SPP</p>
                    <p className="text-xs text-gray-400 mt-1">2 jam yang lalu</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Pendaftar SPMB Baru</p>
                    <p className="text-xs text-gray-500 mt-1">Ada 3 pendaftar baru yang perlu diverifikasi</p>
                    <p className="text-xs text-gray-400 mt-1">5 jam yang lalu</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Pengumuman Baru</p>
                    <p className="text-xs text-gray-500 mt-1">Pembukaan Tahun Ajaran Baru 2026/2027</p>
                    <p className="text-xs text-gray-400 mt-1">1 hari yang lalu</p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Lihat Semua Notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>

          {session?.user && (
            <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.role}</p>
              </div>
            </div>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
