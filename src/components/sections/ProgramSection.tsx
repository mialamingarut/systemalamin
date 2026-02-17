'use client';

import { BookMarked, Lightbulb, Trophy, Globe, Palette, Code } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Image from 'next/image';

export default function ProgramSection() {
  const programs = [
    {
      icon: BookMarked,
      title: 'Program Tahfidz',
      description: 'Menghafal Al-Quran dengan metode mudah dan menyenangkan. Target hafalan 2-3 juz selama 6 tahun.',
      features: ['Metode Tilawati', 'Muroja\'ah Rutin', 'Wisuda Tahfidz'],
      gradient: 'from-emerald-500 to-teal-600',
      image: '/assets/img/program-tahfidz.jpg',
    },
    {
      icon: Lightbulb,
      title: 'Pembelajaran Aktif',
      description: 'Metode pembelajaran inovatif yang mengembangkan kreativitas dan critical thinking siswa.',
      features: ['Project Based Learning', 'STEAM Education', 'Digital Literacy'],
      gradient: 'from-blue-500 to-indigo-600',
      image: '/assets/img/program-learning.jpg',
    },
    {
      icon: Trophy,
      title: 'Ekstrakurikuler',
      description: 'Beragam kegiatan untuk mengembangkan bakat dan minat siswa di berbagai bidang.',
      features: ['Pramuka', 'Seni & Olahraga', 'Robotika'],
      gradient: 'from-amber-500 to-orange-600',
      image: '/assets/img/program-ekskul.jpg',
    },
    {
      icon: Globe,
      title: 'Bahasa Asing',
      description: 'Penguasaan bahasa Arab dan Inggris sejak dini untuk persiapan masa depan global.',
      features: ['Conversation Class', 'Language Camp', 'Native Speaker'],
      gradient: 'from-purple-500 to-pink-600',
      image: '/assets/img/program-language.jpg',
    },
  ];

  return (
    <section id="program" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)`
        }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Program Unggulan
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Program <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Berkualitas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berbagai program unggulan untuk mengembangkan potensi siswa secara optimal dan menyeluruh.
          </p>
        </AnimatedSection>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full">
                {/* Image with Overlay */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Placeholder - replace with actual images */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-90 flex items-center justify-center`}>
                    <program.icon className="w-24 h-24 text-white/50" />
                  </div>
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <program.icon className={`w-7 h-7 bg-gradient-to-br ${program.gradient} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="font-display font-bold text-2xl mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
