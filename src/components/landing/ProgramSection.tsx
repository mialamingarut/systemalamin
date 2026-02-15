'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookMarked, Lightbulb, Trophy, Globe } from 'lucide-react';

export default function ProgramSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const programs = [
    {
      icon: BookMarked,
      title: 'Program Tahfidz',
      description: 'Menghafal Al-Quran dengan metode mudah dan menyenangkan. Target hafalan 2-3 juz selama 6 tahun.',
      features: ['Metode Tilawati', 'Muroja\'ah Rutin', 'Wisuda Tahfidz'],
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Lightbulb,
      title: 'Pembelajaran Aktif',
      description: 'Metode pembelajaran inovatif yang mengembangkan kreativitas dan critical thinking siswa.',
      features: ['Project Based Learning', 'STEAM Education', 'Digital Literacy'],
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Trophy,
      title: 'Ekstrakurikuler',
      description: 'Beragam kegiatan untuk mengembangkan bakat dan minat siswa di berbagai bidang.',
      features: ['Pramuka', 'Seni & Olahraga', 'Robotika'],
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Globe,
      title: 'Bahasa Asing',
      description: 'Penguasaan bahasa Arab dan Inggris sejak dini untuk persiapan masa depan global.',
      features: ['Conversation Class', 'Language Camp', 'Native Speaker'],
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <section id="program" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            Program <span className="gradient-text">Unggulan</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Berbagai program berkualitas untuk mengembangkan potensi siswa secara optimal
          </p>
        </motion.div>

        <div className="space-y-12">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8`}
            >
              <div className="flex-1">
                <div className="glass rounded-3xl p-8 card-hover">
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <program.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3 text-gray-800">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className={`w-full h-64 bg-gradient-to-br ${program.gradient} rounded-3xl shadow-2xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <program.icon className="w-32 h-32 text-white/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
