'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Beranda', href: '#home' },
    { label: 'Tentang', href: '#about' },
    { label: 'Program', href: '#program' },
    { label: 'Guru', href: '#teachers' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'Testimoni', href: '#testimonial' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-gold-500 origin-left z-[100]"
        style={{
          scaleX: 0,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-shadow">
                <Image
                  src="/assets/img/logo.png"
                  alt="MI Al-Amin"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-primary-800">
                  MI Al-Amin
                </h1>
                <p className="text-xs text-gray-600 font-medium">Generasi Qurani Berprestasi</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-primary-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
                >
                  <span>{session.user?.name || 'Dashboard'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-primary-700 font-semibold hover:bg-primary-50 rounded-xl transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="#cta"
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <span>Daftar Sekarang</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 bg-white/95 backdrop-blur-md rounded-2xl mt-4 shadow-xl">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t space-y-2">
                  {session ? (
                    <Link
                      href="/dashboard"
                      className="block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-center"
                    >
                      {session.user?.name || 'Dashboard'}
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-6 py-3 text-primary-700 font-semibold text-center hover:bg-primary-50 rounded-xl transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        href="#cta"
                        className="block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold text-center"
                      >
                        Daftar Sekarang
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
