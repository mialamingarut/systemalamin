'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Beranda', href: '#home' },
    { label: 'Profil', href: '#profile' },
    { label: 'Program', href: '#program' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'SPMB', href: '#spmb' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/assets/img/logo.png" alt="MI Al-Amin Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-primary-800">MI Al-Amin</h1>
              <p className="text-xs text-gray-600">Generasi Qurani</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                <User size={18} />
                <span>{session.user?.name || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 glass rounded-2xl p-4"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center justify-center space-x-2 mt-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-center"
              >
                <User size={18} />
                <span>{session.user?.name || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="block mt-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-center"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
