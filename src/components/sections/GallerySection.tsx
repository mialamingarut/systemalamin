'use client';

import { Image as ImageIcon, Play } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function GallerySection() {
  const galleries = [
    {
      title: 'Kegiatan Belajar',
      image: '/assets/img/gallery-1.jpg',
      category: 'Akademik',
      gradient: 'from-blue-500/90 to-blue-600/90',
    },
    {
      title: 'Tahfidz Quran',
      image: '/assets/img/gallery-2.jpg',
      category: 'Keagamaan',
      gradient: 'from-primary-500/90 to-primary-600/90',
    },
    {
      title: 'Ekstrakurikuler',
      image: '/assets/img/gallery-3.jpg',
      category: 'Kegiatan',
      gradient: 'from-amber-500/90 to-amber-600/90',
    },
    {
      title: 'Prestasi Siswa',
      image: '/assets/img/gallery-4.jpg',
      category: 'Prestasi',
      gradient: 'from-rose-500/90 to-rose-600/90',
    },
    {
      title: 'Fasilitas Sekolah',
      image: '/assets/img/gallery-5.jpg',
      category: 'Fasilitas',
      gradient: 'from-purple-500/90 to-purple-600/90',
    },
    {
      title: 'Kegiatan Outdoor',
      image: '/assets/img/gallery-6.jpg',
      category: 'Kegiatan',
      gradient: 'from-teal-500/90 to-teal-600/90',
    },
  ];

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Galeri Kegiatan
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Dokumentasi <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Aktivitas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat berbagai kegiatan dan prestasi siswa MI Al-Amin dalam dokumentasi visual kami.
          </p>
        </AnimatedSection>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((item, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                {/* Placeholder Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <ImageIcon className="w-20 h-20 text-white/30" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold mb-3 w-fit">
                    {item.category}
                  </span>
                  <h3 className="font-display font-bold text-xl text-white mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform">
                    {item.title}
                  </h3>
                  
                  {/* Hover Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Zoom Effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
