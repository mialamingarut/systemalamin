'use client';

import { Award, Users, GraduationCap, Calendar } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CountUp from '@/components/ui/CountUp';

type Stats = {
  students: number;
  teachers: number;
  years: number;
};

export default function TrustSection({ stats }: { stats: Stats }) {
  const statsData = [
    {
      icon: Award,
      value: 'A',
      label: 'Akreditasi',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Users,
      value: stats.students,
      suffix: '+',
      label: 'Siswa Aktif',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: GraduationCap,
      value: stats.teachers,
      suffix: '+',
      label: 'Guru Profesional',
      color: 'from-gold-500 to-gold-600',
    },
    {
      icon: Calendar,
      value: stats.years,
      label: 'Tahun Pengalaman',
      color: 'from-rose-500 to-rose-600',
    },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(16, 185, 129, 0.1) 35px, rgba(16, 185, 129, 0.1) 70px)`
        }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="font-display font-bold text-3xl text-gray-900 mb-1">
                  {typeof stat.value === 'number' ? (
                    <>
                      <CountUp end={stat.value} />
                      {stat.suffix}
                    </>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
