'use server';

import { prisma } from '@/lib/prisma';

export async function getLandingData() {
  const [hero, stats, programs, testimonials, gallery, about, features] = await Promise.all([
    prisma.landingHero.findFirst({ where: { isActive: true } }),
    prisma.landingStats.findFirst({ where: { isActive: true } }),
    prisma.landingProgram.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.landingTestimonial.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.landingGallery.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { order: 'asc' },
      take: 12,
    }),
    prisma.landingAbout.findFirst({ where: { isActive: true } }),
    prisma.landingFeature.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  return {
    hero: hero || {
      headline: 'Generasi Qurani Berprestasi',
      subheadline: 'Membentuk karakter islami dan prestasi akademik yang unggul untuk masa depan gemilang',
      ctaPrimary: 'Daftar Sekarang',
      ctaSecondary: 'Pelajari Lebih Lanjut',
    },
    stats: stats || {
      students: 500,
      teachers: 25,
      years: 15,
    },
    programs,
    testimonials,
    gallery,
    about: about || {
      title: 'Tentang MI Al-Amin',
      description: 'Madrasah Ibtidaiyah terdepan yang memadukan pendidikan Islam berkualitas dengan prestasi akademik unggul',
      vision: 'Menjadi madrasah ibtidaiyah terdepan yang menghasilkan generasi Qurani, berprestasi, dan berakhlak mulia',
      mission: [],
      history: '',
    },
    features,
  };
}
