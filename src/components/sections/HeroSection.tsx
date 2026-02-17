'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Play, Award, Users, BookOpen } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-gold-50">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Floating Shapes */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-primary-600/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-gold-400/20 to-gold-600/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-lg mb-6"
            >
              <Award className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-700">Terakreditasi A</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight"
            >
              Membentuk Generasi{' '}
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-gold-500 bg-clip-text text-transparent">
                Qurani Berprestasi
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Madrasah Ibtidaiyah terdepan yang memadukan pendidikan Islam berkualitas dengan prestasi akademik unggul untuk masa depan gemilang putra-putri Anda.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="#cta"
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Daftar Sekarang</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2 border-2 border-primary-100">
                <Play className="w-5 h-5" />
                <span>Lihat Video</span>
              </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                  <Users className="w-5 h-5 text-primary-600" />
                  <p className="font-bold text-2xl text-gray-900">500+</p>
                </div>
                <p className="text-sm text-gray-600">Siswa Aktif</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <p className="font-bold text-2xl text-gray-900">25+</p>
                </div>
                <p className="text-sm text-gray-600">Guru Profesional</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                  <Award className="w-5 h-5 text-primary-600" />
                  <p className="font-bold text-2xl text-gray-900">15</p>
                </div>
                <p className="text-sm text-gray-600">Tahun Berpengalaman</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px]">
              {/* Placeholder for illustration - replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-gold-100 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <BookOpen className="w-32 h-32 text-primary-600 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-medium">Hero Illustration</p>
                  <p className="text-sm text-gray-400 mt-2">Replace with actual image</p>
                </div>
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 -left-10 bg-white rounded-2xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Prestasi</p>
                    <p className="font-bold text-gray-900">Juara 1 Olimpiade</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute bottom-10 -right-10 bg-white rounded-2xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="font-bold text-gray-900">Tahfidz Quran</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
