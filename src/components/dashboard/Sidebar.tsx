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
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [landingMenuOpen, setLandingMenuOpen] = useState(pathname.startsWith('/dashboard/landing'));

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

  const landingSubItems = [
    { label: 'Hero & Statistik', href: '/dashboard/landing/hero' },
    { label: 'Tentang & Keunggulan', href: '/dashboard/landing/about' },
    { label: 'Galeri', href: '/dashboard/landing/gallery' },
    { label: 'Program', href: '/dashboard/landing/programs' },
    { label: 'Testimoni', href: '/dashboard/landing/testimonials' },
    { label: 'CTA & Pendaftaran', href: '/dashboard/landing/cta' },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-primary-900 to-primary-800 text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } flex flex-col h-screen sticky top-0`}
    >
      {/* Fixed Logo Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/assets/img/logo.png" 
                alt="MI Al-Amin Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-bold text-xl">MA</span>';
                }}
              />
            </div>
            <div>
              <h2 className="font-bold text-sm">ASMS</h2>
              <p className="text-xs text-primary-200">Al-Amin</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
            <img 
              src="/assets/img/logo.png" 
              alt="MI Al-Amin Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-bold text-sm">MA</span>';
              }}
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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

        {/* Landing Page Menu with Submenu */}
        <div>
          <button
            onClick={() => setLandingMenuOpen(!landingMenuOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              pathname.startsWith('/dashboard/landing')
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-primary-100 hover:bg-white/10 hover:text-white'
            }`}
            title={collapsed ? 'Landing Page' : ''}
          >
            <div className="flex items-center space-x-3">
              <Globe size={20} className="flex-shrink-0" />
              {!collapsed && <span className="font-medium">Landing Page</span>}
            </div>
            {!collapsed && (
              landingMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            )}
          </button>

          {/* Submenu */}
          {!collapsed && landingMenuOpen && (
            <div className="ml-4 mt-2 space-y-1">
              {landingSubItems.map((subItem) => {
                const isActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-primary-100 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Fixed User Profile */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
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
