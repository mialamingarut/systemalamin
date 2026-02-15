'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, Users, FileText, CheckCircle, Clock } from 'lucide-react';

export default function SPMBSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const steps = [
    { icon: FileText, title: 'Daftar Online', description: 'Isi formulir pendaftaran' },
    { icon: Users, title: 'Verifikasi', description: 'Tim kami verifikasi data' },
    { icon: Calendar, title: 'Tes Seleksi', description: 'Ikuti tes masuk' },
    { icon: CheckCircle, title: 'Pengumuman', description: 'Cek hasil kelulusan' },
  ];

  return (
    <section id="spmb" ref={ref} className="py-24 bg-gradient-to-b from-primary-50/30 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-full mb-4 font-semibold">
            <Clock className="w-4 h-4" />
            <span>Pendaftaran Dibuka!</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            Pendaftaran Siswa Baru <span className="gradient-text">2026/2027</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bergabunglah bersama kami dan raih masa depan gemilang bersama MI Al-Amin
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass rounded-3xl p-8 shadow-2xl">
            <h3 className="text-center font-display font-semibold text-xl mb-6 text-gray-800">
              Pendaftaran Gelombang 1 Berakhir Dalam:
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Hari', value: timeLeft.days },
                { label: 'Jam', value: timeLeft.hours },
                { label: 'Menit', value: timeLeft.minutes },
                { label: 'Detik', value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-4 mb-2 shadow-lg">
                    <div className="text-4xl md:text-5xl font-bold text-white">
                      {String(item.value).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Kuota Tersisa: <strong className="text-primary-600">25 dari 100</strong></span>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-6 text-center card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <h4 className="font-display font-semibold text-lg mb-2 text-gray-800">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <a
            href="/spmb/register"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all glow-primary"
          >
            <span>Daftar Sekarang</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.span>
          </a>
          <p className="mt-4 text-sm text-gray-600">
            Atau hubungi kami di <strong className="text-primary-600">0812-3456-7890</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
