'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import TeacherCard from './TeacherCard';

interface Teacher {
  id: string;
  user: {
    name: string;
  };
  subjects: string[];
  position?: string;
}

interface TeachersSectionProps {
  teachers: Teacher[];
}

export default function TeachersSection({ teachers }: TeachersSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Show only first 4 teachers on landing page
  const displayTeachers = teachers.slice(0, 4);

  return (
    <section id="teachers" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            <span className="gradient-text">Guru Kami</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tenaga pendidik profesional dan berpengalaman yang siap membimbing putra-putri Anda
          </p>
        </motion.div>

        {displayTeachers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayTeachers.map((teacher, index) => (
                <TeacherCard
                  key={teacher.id}
                  name={teacher.user.name}
                  photo={null}
                  subjects={teacher.subjects}
                  position={teacher.position || 'Guru'}
                  index={index}
                />
              ))}
            </div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <Link
                href="/dashboard/teachers"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Lihat Semua Guru</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
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
