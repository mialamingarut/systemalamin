'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  FileText,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Data Siswa', href: '/dashboard/students' },
    { icon: GraduationCap, label: 'Data Guru', href: '/dashboard/teachers' },
    { icon: BookOpen, label: 'Kelas', href: '/dashboard/classes' },
    { icon: FileText, label: 'SPMB', href: '/dashboard/spmb' },
    { icon: DollarSign, label: 'Keuangan', href: '/dashboard/finance' },
    { icon: Calendar, label: 'Akademik', href: '/dashboard/academic' },
    { icon: Settings, label: 'Pengaturan', href: '/dashboard/settings' },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-primary-900 to-primary-800 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white">
              <img src="/assets/img/logo.png" alt="MI Al-Amin Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-sm">ASMS</h2>
              <p className="text-xs text-primary-200">Al-Amin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">AD</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-primary-200">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
