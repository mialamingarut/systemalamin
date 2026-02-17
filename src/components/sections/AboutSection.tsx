'use client';

import { BookOpen, Heart, Award, Users, Target, Shield } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function AboutSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Kurikulum Terintegrasi',
      description: 'Memadukan kurikulum nasional dengan nilai-nilai Islam yang kuat dan komprehensif.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Pendidikan Karakter',
      description: 'Membentuk akhlakul karimah dan kepribadian islami yang berintegritas tinggi.',
      color: 'from-rose-500 to-rose-600',
    },
    {
      icon: Award,
      title: 'Prestasi Gemilang',
      description: 'Raih berbagai prestasi akademik dan non-akademik tingkat regional dan nasional.',
      color: 'from-gold-500 to-gold-600',
    },
    {
      icon: Users,
      title: 'Guru Berkualitas',
      description: 'Tenaga pendidik profesional, berpengalaman, dan berdedikasi tinggi.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Target,
      title: 'Metode Pembelajaran Modern',
      description: 'Pendekatan pembelajaran aktif, kreatif, dan inovatif sesuai perkembangan zaman.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Lingkungan Aman & Nyaman',
      description: 'Fasilitas lengkap dan lingkungan kondusif untuk tumbuh kembang optimal.',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-primary-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-100/50 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Mengapa Memilih Kami
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Keunggulan <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">MI Al-Amin</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Komitmen kami adalah mencetak generasi Qurani yang berakhlak mulia, cerdas, dan berprestasi untuk masa depan gemilang.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Vision Mission */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <AnimatedSection direction="left">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 text-white shadow-2xl h-full">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">Visi Kami</h3>
              <p className="text-white/90 leading-relaxed">
                Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qurani, berakhlak mulia, cerdas, mandiri, dan berprestasi dalam menghadapi tantangan zaman.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-3xl p-8 text-white shadow-2xl h-full">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">Misi Kami</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Menyelenggarakan pendidikan berkualitas berbasis Al-Quran dan Hadits</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Membentuk karakter islami yang kuat dan berakhlak mulia</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Mengembangkan potensi akademik dan non-akademik siswa secara optimal</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
