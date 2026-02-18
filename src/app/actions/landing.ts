'use server';

import { prisma } from '@/lib/prisma';

export async function getSystemConfig() {
  const configs = await prisma.systemConfig.findMany({
    where: {
      key: {
        in: ['school_name', 'school_address', 'school_phone', 'school_email', 'social_facebook', 'social_instagram', 'social_youtube'],
      },
    },
  });

  const configMap = configs.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    schoolName: configMap.school_name || 'MI Al-Amin',
    schoolAddress: configMap.school_address || 'Jl. Pendidikan No. 123, Jakarta Selatan',
    schoolPhone: configMap.school_phone || '0812-3456-7890',
    schoolEmail: configMap.school_email || 'info@mialamin.sch.id',
    socialFacebook: configMap.social_facebook || '#',
    socialInstagram: configMap.social_instagram || '#',
    socialYoutube: configMap.social_youtube || '#',
  };
}

export async function getLandingData() {
  const [hero, stats, programs, testimonials, gallery, about, features, cta] = await Promise.all([
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
    prisma.landingCTA.findFirst({ where: { isActive: true } }),
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
    cta: cta || {
      title: 'Daftarkan Putra-Putri Anda Sekarang!',
      subtitle: 'Pendaftaran Dibuka',
      description: 'Bergabunglah dengan keluarga besar MI Al-Amin dan berikan pendidikan terbaik untuk masa depan gemilang anak Anda. Kuota terbatas!',
      benefits: [
        'Diskon biaya pendaftaran 20%',
        'Gratis seragam lengkap',
        'Prioritas pemilihan kelas',
        'Konsultasi gratis dengan psikolog',
        'Akses fasilitas lengkap',
        'Bimbingan tahfidz intensif',
      ],
    },
  };
}
