'use client';

import { User, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Link from 'next/link';
import Image from 'next/image';

interface Teacher {
  id: string;
  user: {
    name: string;
  };
  subjects: string[];
  photo: string | null;
  position?: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
}

export default function TeachersSection({ teachers }: TeachersSectionProps) {
  const displayTeachers = teachers.slice(0, 6);

  return (
    <section id="teachers" className="py-24 bg-gradient-to-b from-white via-primary-50/20 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-400/10 to-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-gold-400/10 to-primary-400/10 rounded-full blur-3xl" />
      
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, rgba(16, 185, 129, 0.4) 2px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Tim Pengajar Profesional</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Guru <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Berpengalaman</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tenaga pendidik berkualitas dan berdedikasi tinggi yang siap membimbing putra-putri Anda meraih prestasi gemilang.
          </p>
        </AnimatedSection>

        {displayTeachers.length > 0 ? (
          <>
            {/* Teachers Grid - Modern Profile Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayTeachers.map((teacher, index) => (
                <AnimatedSection key={teacher.id} delay={index * 0.1}>
                  <div className="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Corner Accent - Top Left */}
                    <div className="absolute top-0 left-0 w-20 h-20 z-10">
                      <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-primary-400 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* Corner Accent - Bottom Right */}
                    <div className="absolute bottom-0 right-0 w-20 h-20 z-10">
                      <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-gold-400 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Photo Container */}
                    <div className="relative w-full h-full">
                      {teacher.photo ? (
                        <Image
                          src={teacher.photo}
                          alt={teacher.user.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center">
                          <User className="w-32 h-32 text-white/30" />
                        </div>
                      )}
                      
                      {/* Gradient Overlay - Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/0 to-primary-600/0 group-hover:from-primary-600/20 group-hover:to-transparent transition-all duration-500" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                      {/* Decorative Line */}
                      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-gold-400 rounded-full mb-4 group-hover:w-24 transition-all duration-500" />
                      
                      {/* Name */}
                      <h3 className="font-display font-bold text-2xl text-white mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                        {teacher.user.name}
                      </h3>
                      
                      {/* Position/Role */}
                      <p className="text-primary-200 font-medium mb-3 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500 delay-75">
                        {teacher.position || 'Guru'}
                      </p>
                      
                      {/* Subjects */}
                      <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        {teacher.subjects.slice(0, 2).map((subject, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                          >
                            {subject}
                          </span>
                        ))}
                        {teacher.subjects.length > 2 && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                            +{teacher.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Floating Accent Icon */}
                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 z-10">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>

                    {/* Border Gradient on Hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/50 via-transparent to-gold-400/50 blur-sm" />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* View All Button */}
            <AnimatedSection delay={0.6}>
              <div className="text-center">
                <Link
                  href="/dashboard/teachers"
                  className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  
                  <span className="relative z-10">Lihat Semua Guru</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
              </div>
            </AnimatedSection>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Data guru akan segera ditampilkan</p>
          </div>
        )}
      </div>
    </section>
  );
}
