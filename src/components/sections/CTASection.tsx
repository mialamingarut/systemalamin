'use client';

import { ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Link from 'next/link';

type CTASectionProps = {
  cta: {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
  };
  config: {
    schoolPhone: string;
    schoolEmail: string;
    schoolAddress: string;
  };
};

export default function CTASection({ cta, config }: CTASectionProps) {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-gold-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <AnimatedSection direction="left">
            <div className="text-white">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                {cta.subtitle}
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 leading-tight">
                {cta.title}
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                {cta.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/spmb/register"
                  className="group px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Daftar Online</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`tel:+62${config.schoolPhone.replace(/^0/, '')}`}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2 border-2 border-white/30"
                >
                  <Phone className="w-5 h-5" />
                  <span>Hubungi Kami</span>
                </a>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/90">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>{config.schoolPhone}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>{config.schoolEmail}</span>
                </div>
                <div className="flex items-start space-x-3 text-white/90">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{config.schoolAddress}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Content - Benefits */}
          <AnimatedSection direction="right">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h3 className="font-display font-bold text-2xl text-white mb-6">
                Keuntungan Mendaftar Sekarang
              </h3>
              <div className="space-y-4">
                {cta.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
