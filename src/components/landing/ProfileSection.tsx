'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Heart, Award, Users } from 'lucide-react';

export default function ProfileSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: BookOpen,
      title: 'Kurikulum Terintegrasi',
      description: 'Memadukan kurikulum nasional dengan nilai-nilai Islam',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Pendidikan Karakter',
      description: 'Membentuk akhlak mulia dan kepribadian islami',
      color: 'from-rose-500 to-rose-600',
    },
    {
      icon: Award,
      title: 'Prestasi Gemilang',
      description: 'Raih berbagai prestasi akademik dan non-akademik',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: Users,
      title: 'Guru Berkualitas',
      description: 'Tenaga pendidik profesional dan berpengalaman',
      color: 'from-primary-500 to-primary-600',
    },
  ];

  return (
    <section id="profile" ref={ref} className="py-24 bg-gradient-to-b from-white to-primary-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            Profil <span className="gradient-text">Madrasah</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            MI Al-Amin berkomitmen mencetak generasi Qurani yang berakhlak mulia, cerdas, dan berprestasi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-6 card-hover h-full">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visi Misi */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-3xl p-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-primary-900">Visi</h3>
            <p className="text-gray-700 leading-relaxed">
              Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qurani, berakhlak mulia, 
              cerdas, mandiri, dan berprestasi dalam menghadapi tantangan zaman.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass rounded-3xl p-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h3 className="font-display font-bold text-2xl mb-4 text-primary-900">Misi</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Menyelenggarakan pendidikan berkualitas berbasis Al-Quran dan Hadits</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Membentuk karakter islami yang kuat dan berakhlak mulia</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Mengembangkan potensi akademik dan non-akademik siswa</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
