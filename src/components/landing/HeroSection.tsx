'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [text, setText] = useState('');
  const fullText = 'Membentuk Generasi Qurani Berakhlak Mulia';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden islamic-pattern">
      {/* Floating Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-primary-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white/30 to-white" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-medium text-gray-700">Terakreditasi A</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-bold text-5xl md:text-7xl mb-6 text-primary-900"
          >
            Madrasah Ibtidaiyah
            <span className="block gradient-text mt-2">Al-Amin</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-16 mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {text}
              <span className="animate-pulse">|</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#spmb"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center space-x-2"
            >
              <span>Daftar Sekarang</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
            <a
              href="#profile"
              className="px-8 py-4 glass-dark text-gray-700 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Pelajari Lebih Lanjut
            </a>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '500+', label: 'Siswa Aktif' },
              { value: '25+', label: 'Guru Profesional' },
              { value: '15', label: 'Tahun Berpengalaman' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="w-8 h-8 text-primary-600" />
      </motion.div>
    </section>
  );
}
