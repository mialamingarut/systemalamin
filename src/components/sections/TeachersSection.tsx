'use client';

import { User, BookOpen, ArrowRight } from 'lucide-react';
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
  const displayTeachers = teachers.slice(0, 4);

  return (
    <section id="teachers" className="py-24 bg-gradient-to-b from-primary-50/30 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Tim Pengajar
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Guru Profesional</span> Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tenaga pendidik berpengalaman dan berdedikasi tinggi yang siap membimbing putra-putri Anda meraih prestasi.
          </p>
        </AnimatedSection>

        {displayTeachers.length > 0 ? (
          <>
            {/* Teachers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayTeachers.map((teacher, index) => (
                <AnimatedSection key={teacher.id} delay={index * 0.1}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full">
                    {/* Photo Section */}
                    <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
                      {teacher.photo ? (
                        <Image
                          src={teacher.photo}
                          alt={teacher.user.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-24 h-24 text-white/50" />
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Position Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
                          {teacher.position || 'Guru'}
                        </span>
                      </div>

                      {/* Glow Effect on Hover */}
                      <div className="absolute inset-0 bg-primary-400/0 group-hover:bg-primary-400/10 transition-colors duration-300" />
                    </div>

                    {/* Info Section */}
                    <div className="p-6">
                      {/* Name */}
                      <h3 className="font-display font-bold text-lg text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {teacher.user.name}
                      </h3>

                      {/* Subjects */}
                      <div className="flex items-start space-x-2">
                        <BookOpen className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium mb-2">Mata Pelajaran:</p>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.slice(0, 2).map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
                              >
                                {subject}
                              </span>
                            ))}
                            {teacher.subjects.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                +{teacher.subjects.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Decorative Line */}
                      <div className="mt-4 h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full group-hover:w-full transition-all duration-500" />
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* View All Button */}
            <AnimatedSection delay={0.5}>
              <div className="text-center">
                <Link
                  href="/dashboard/teachers"
                  className="group inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <span>Lihat Semua Guru</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Data guru akan segera ditampilkan</p>
          </div>
        )}
      </div>
    </section>
  );
}
