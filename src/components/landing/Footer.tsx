'use client';

import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">MA</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">MI Al-Amin</h3>
                <p className="text-xs text-primary-200">Generasi Qurani</p>
              </div>
            </div>
            <p className="text-primary-100 text-sm leading-relaxed">
              Membentuk generasi Qurani yang berakhlak mulia, cerdas, dan berprestasi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Menu</h4>
            <ul className="space-y-2">
              {['Beranda', 'Profil', 'Program', 'Galeri', 'SPMB'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-primary-100">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Jl. Pendidikan No. 123, Jakarta Selatan</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-primary-100">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-primary-100">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@mialamin.sch.id</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Ikuti Kami</h4>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-primary-200 text-sm">
            © 2026 MI Al-Amin. All rights reserved. Built with ❤️ for better education.
          </p>
        </div>
      </div>
    </footer>
  );
}
