'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const activities = [
    { title: 'Kegiatan Pembelajaran', color: 'from-blue-500 to-blue-600' },
    { title: 'Program Tahfidz', color: 'from-primary-500 to-primary-600' },
    { title: 'Ekstrakurikuler', color: 'from-purple-500 to-purple-600' },
    { title: 'Kegiatan Islami', color: 'from-emerald-500 to-emerald-600' },
    { title: 'Outing Class', color: 'from-amber-500 to-amber-600' },
    { title: 'Prestasi Siswa', color: 'from-rose-500 to-rose-600' },
  ];

  return (
    <section id="gallery" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            Galeri <span className="gradient-text">Kegiatan</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dokumentasi berbagai kegiatan dan prestasi siswa MI Al-Amin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-video cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} transition-transform group-hover:scale-110`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-display font-semibold text-xl text-center">
                    {activity.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 glass-dark rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
            Lihat Semua Galeri
          </button>
        </motion.div>
      </div>
    </section>
  );
}
