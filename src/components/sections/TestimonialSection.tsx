'use client';

import { Star, Quote, User } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Image from 'next/image';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string | null;
  rating: number;
};

type TestimonialSectionProps = {
  testimonials: Testimonial[];
};

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonial" className="py-24 bg-gradient-to-b from-white to-primary-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold-100/50 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-100/50 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Testimoni
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-gray-900">
            Kata <span className="bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">Orang Tua</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kepercayaan dan kepuasan orang tua adalah motivasi kami untuk terus memberikan yang terbaik.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 0.1}>
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-primary-600" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {testimonial.avatar ? (
                      <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
