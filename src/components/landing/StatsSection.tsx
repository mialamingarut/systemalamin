'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, GraduationCap, Award, Calendar } from 'lucide-react';

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    { icon: Users, value: 500, label: 'Siswa Aktif', suffix: '+', color: 'from-blue-500 to-blue-600' },
    { icon: GraduationCap, value: 25, label: 'Guru Profesional', suffix: '+', color: 'from-primary-500 to-primary-600' },
    { icon: Award, value: 50, label: 'Prestasi Diraih', suffix: '+', color: 'from-amber-500 to-amber-600' },
    { icon: Calendar, value: 15, label: 'Tahun Berpengalaman', suffix: '', color: 'from-rose-500 to-rose-600' },
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-white">
            Prestasi & <span className="text-gold-400">Pencapaian</span>
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Angka-angka yang membuktikan komitmen kami dalam memberikan pendidikan terbaik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index, isInView }: any) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = stat.value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="glass rounded-2xl p-8 text-center card-hover border border-white/20">
        <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
          <stat.icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-5xl font-bold text-white mb-2 glow-primary">
          {count}{stat.suffix}
        </div>
        <div className="text-primary-100 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}
