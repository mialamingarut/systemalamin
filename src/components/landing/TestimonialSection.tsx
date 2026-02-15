'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: 'Ibu Siti Aminah',
      role: 'Orang Tua Siswa Kelas 5',
      content: 'Alhamdulillah, anak saya berkembang sangat baik di MI Al-Amin. Tidak hanya pintar secara akademik, tapi juga akhlaknya semakin baik. Program tahfidznya sangat membantu.',
      rating: 5,
    },
    {
      name: 'Bapak Ahmad Fauzi',
      role: 'Orang Tua Siswa Kelas 3',
      content: 'Guru-gurunya sangat perhatian dan profesional. Fasilitas sekolah juga lengkap. Anak saya senang belajar di sini dan prestasinya terus meningkat.',
      rating: 5,
    },
    {
      name: 'Ibu Fatimah Zahra',
      role: 'Orang Tua Siswa Kelas 6',
      content: 'MI Al-Amin adalah pilihan terbaik untuk pendidikan anak. Lingkungan islami, pembelajaran modern, dan guru yang kompeten. Sangat recommended!',
      rating: 5,
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-primary-900">
            Testimoni <span className="gradient-text">Orang Tua</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Kepercayaan orang tua adalah motivasi kami untuk terus memberikan yang terbaik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 card-hover h-full">
                <Quote className="w-10 h-10 text-primary-200 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-display font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
