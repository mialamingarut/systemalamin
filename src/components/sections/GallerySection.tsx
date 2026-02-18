'use client';

import { Image as ImageIcon, Play } from 'lucide-react';
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

const gradients = [
  'from-blue-500/90 to-blue-600/90',
  'from-primary-500/90 to-primary-600/90',
  'from-amber-500/90 to-amber-600/90',
  'from-rose-500/90 to-rose-600/90',
  'from-purple-500/90 to-purple-600/90',
  'from-teal-500/90 to-teal-600/90',
];

export default function GallerySection({ gallery }: GallerySectionProps) {
  if (gallery.length === 0) return null;

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
          {gallery.map((item, index) => {
            const gradient = gradients[index % gradients.length];
            
            return (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  {/* Image */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {item.category && (
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold mb-3 w-fit">
                        {item.category}
                      </span>
                    )}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
