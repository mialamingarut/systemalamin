'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Program', href: '#program' },
    { label: 'Guru', href: '#teachers' },
    { label: 'Galeri', href: '#gallery' },
  ];

  const programs = [
    { label: 'Program Tahfidz', href: '#program' },
    { label: 'Pembelajaran Aktif', href: '#program' },
    { label: 'Ekstrakurikuler', href: '#program' },
    { label: 'Bahasa Asing', href: '#program' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Main Footer */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/assets/img/logo.png"
                  alt="MI Al-Amin"
                  width={48}
                  height={48}
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">MI Al-Amin</h3>
                <p className="text-xs text-gray-400">Generasi Qurani Berprestasi</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Madrasah Ibtidaiyah terdepan yang mencetak generasi Qurani berakhlak mulia dan berprestasi.
            </p>
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Menu Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Program Kami</h4>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.label}>
                  <Link
                    href={program.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center space-x-2 group"
                  >
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span>{program.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Otista No.214, Langensari, Kec. Tarogong Kaler, Kabupaten Garut, Jawa Barat 44151</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+6281234567890" className="hover:text-primary-400 transition-colors">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@mialamin.sch.id" className="hover:text-primary-400 transition-colors">
                  info@mialamin.sch.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} MI Al-Amin. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
