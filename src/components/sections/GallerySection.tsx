'use client';

import { ImageIcon, ZoomIn } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Image from 'next/image';

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image: string;
  category: string | null;
};

type GallerySectionProps = {
  gallery: GalleryItem[];
};

export default function GallerySection({ gallery }: GallerySectionProps) {
  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold-100 rounded-full blur-3xl opacity-30" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-600 to-gold-500 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
            Galeri Kegiatan
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Dokumentasi <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Aktivitas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat berbagai kegiatan dan prestasi siswa MI Al-Amin dalam dokumentasi visual kami.
          </p>
        </AnimatedSection>

        {/* Gallery Grid - Masonry Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, index) => {
            // Alternate heights for masonry effect
            const heights = ['h-72', 'h-80', 'h-96'];
            const height = heights[index % heights.length];
            
            return (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <div className={`group relative ${height} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer`}>
                  {/* Image with Zoom Effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Category Badge */}
                    {item.category && (
                      <div className="mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary-500 to-gold-500 text-white rounded-full text-xs font-bold shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {item.title}
                    </h3>

                    {/* Description - Show on Hover */}
                    {item.description && (
                      <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Zoom Icon - Show on Hover */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* View More Button */}
        {gallery.length > 6 && (
          <AnimatedSection className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-gold-500 text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Lihat Semua Galeri
            </button>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
