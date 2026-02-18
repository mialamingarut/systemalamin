import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { name: '2026/2027' },
    update: {},
    create: {
      name: '2026/2027',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2027-06-30'),
      isActive: true,
    },
  });

  console.log('✅ Academic year created');

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mialamin.sch.id' },
    update: {},
    create: {
      email: 'admin@mialamin.sch.id',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Super admin created');

  // Create Sample Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'guru@mialamin.sch.id' },
    update: {},
    create: {
      email: 'guru@mialamin.sch.id',
      password: hashedPassword,
      name: 'Ahmad Fauzi, S.Pd',
      role: 'TEACHER',
      isActive: true,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      nip: '198501012010011001',
      phone: '081234567890',
      address: 'Jl. Pendidikan No. 123, Jakarta',
      dateOfBirth: new Date('1985-01-01'),
      gender: 'MALE',
      joinDate: new Date('2010-07-01'),
      subjects: ['Matematika', 'IPA'], // PostgreSQL supports array directly
      photo: null, // Photo can be uploaded later via dashboard
    },
  });

  console.log('✅ Sample teacher created');

  // Create Sample Class
  const class1A = await prisma.class.upsert({
    where: {
      name_academicYearId: {
        name: 'Kelas 1A',
        academicYearId: academicYear.id,
      },
    },
    update: {},
    create: {
      name: 'Kelas 1A',
      grade: 1,
      academicYearId: academicYear.id,
      teacherId: teacher.id,
      capacity: 30,
    },
  });

  console.log('✅ Sample class created');

  // Create Sample Parent
  const parentUser = await prisma.user.upsert({
    where: { email: 'orangtua@example.com' },
    update: {},
    create: {
      email: 'orangtua@example.com',
      password: hashedPassword,
      name: 'Budi Santoso',
      role: 'PARENT',
      isActive: true,
    },
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      userId: parentUser.id,
      fatherName: 'Budi Santoso',
      motherName: 'Siti Aminah',
      phone: '081234567891',
      address: 'Jl. Keluarga No. 456, Jakarta',
      occupation: 'Wiraswasta',
    },
  });

  console.log('✅ Sample parent created');

  // Create Sample Students
  const student1 = await prisma.student.upsert({
    where: { nis: '2026001' },
    update: {},
    create: {
      nis: '2026001',
      nisn: '0012345678',
      name: 'Muhammad Rizki',
      gender: 'MALE',
      dateOfBirth: new Date('2019-05-15'),
      placeOfBirth: 'Jakarta',
      address: 'Jl. Keluarga No. 456, Jakarta',
      phone: '081234567891',
      parentId: parent.id,
      enrollmentDate: new Date('2026-07-01'),
      isActive: true,
    },
  });

  const student2 = await prisma.student.upsert({
    where: { nis: '2026002' },
    update: {},
    create: {
      nis: '2026002',
      nisn: '0012345679',
      name: 'Fatimah Zahra',
      gender: 'FEMALE',
      dateOfBirth: new Date('2019-08-20'),
      placeOfBirth: 'Jakarta',
      address: 'Jl. Keluarga No. 456, Jakarta',
      phone: '081234567891',
      parentId: parent.id,
      enrollmentDate: new Date('2026-07-01'),
      isActive: true,
    },
  });

  const students = [student1, student2];

  console.log('✅ Sample students created');

  // Assign students to class
  for (const student of students) {
    await prisma.classStudent.upsert({
      where: {
        classId_studentId: {
          classId: class1A.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        classId: class1A.id,
        studentId: student.id,
      },
    });
  }

  console.log('✅ Students assigned to class');

  // Create Sample SPMB Applicants
  await prisma.sPMBApplicant.upsert({
    where: { registrationNo: 'SPMB-2026-0001' },
    update: {},
    create: {
      registrationNo: 'SPMB-2026-0001',
      academicYearId: academicYear.id,
      name: 'Ahmad Zaki',
      gender: 'MALE',
      dateOfBirth: new Date('2019-03-10'),
      placeOfBirth: 'Jakarta',
      address: 'Jl. Pendaftar No. 1, Jakarta',
      parentName: 'Hasan Abdullah',
      parentPhone: '081234567892',
      parentEmail: 'hasan@example.com',
      previousSchool: 'TK Harapan Bangsa',
      status: 'REGISTERED',
    },
  });

  await prisma.sPMBApplicant.upsert({
    where: { registrationNo: 'SPMB-2026-0002' },
    update: {},
    create: {
      registrationNo: 'SPMB-2026-0002',
      academicYearId: academicYear.id,
      name: 'Aisyah Putri',
      gender: 'FEMALE',
      dateOfBirth: new Date('2019-06-25'),
      placeOfBirth: 'Jakarta',
      address: 'Jl. Pendaftar No. 2, Jakarta',
      parentName: 'Ibrahim Malik',
      parentPhone: '081234567893',
      parentEmail: 'ibrahim@example.com',
      previousSchool: 'RA Al-Ikhlas',
      status: 'VERIFIED',
    },
  });

  console.log('✅ Sample SPMB applicants created');

  // Create Sample Announcements
  await prisma.announcement.upsert({
    where: { id: 'announcement-1' },
    update: {},
    create: {
      id: 'announcement-1',
      title: 'Pembukaan Tahun Ajaran Baru 2026/2027',
      content:
        'Dengan penuh syukur, kami mengumumkan pembukaan tahun ajaran baru 2026/2027. Kegiatan pembelajaran akan dimulai pada tanggal 15 Juli 2026.',
      academicYearId: academicYear.id,
      isPinned: true,
    },
  });

  await prisma.announcement.upsert({
    where: { id: 'announcement-2' },
    update: {},
    create: {
      id: 'announcement-2',
      title: 'Pendaftaran SPMB Gelombang 1',
      content:
        'Pendaftaran siswa baru gelombang 1 telah dibuka. Segera daftarkan putra-putri Anda untuk mendapatkan kesempatan terbaik.',
      academicYearId: academicYear.id,
      isPinned: true,
    },
  });

  console.log('✅ Sample announcements created');

  // Create System Config
  await prisma.systemConfig.upsert({
    where: { key: 'school_name' },
    update: {},
    create: {
      key: 'school_name',
      value: 'Madrasah Ibtidaiyah Al-Amin',
      description: 'Nama sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'school_address' },
    update: {},
    create: {
      key: 'school_address',
      value: 'Jl. Otista No.214, Langensari, Kec. Tarogong Kaler, Kabupaten Garut, Jawa Barat 44151',
      description: 'Alamat sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'school_phone' },
    update: {},
    create: {
      key: 'school_phone',
      value: '0812-3456-7890',
      description: 'Nomor telepon sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'school_email' },
    update: {},
    create: {
      key: 'school_email',
      value: 'info@mialamin.sch.id',
      description: 'Email sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'spp_amount' },
    update: {},
    create: {
      key: 'spp_amount',
      value: '250000',
      description: 'Nominal SPP per bulan',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'social_facebook' },
    update: {},
    create: {
      key: 'social_facebook',
      value: '#',
      description: 'Link Facebook sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'social_instagram' },
    update: {},
    create: {
      key: 'social_instagram',
      value: '#',
      description: 'Link Instagram sekolah',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'social_youtube' },
    update: {},
    create: {
      key: 'social_youtube',
      value: '#',
      description: 'Link YouTube sekolah',
    },
  });

  console.log('✅ System config created');

  // Seed Landing Page CMS Data
  console.log('🌱 Seeding landing page CMS...');

  // Landing Hero
  await prisma.landingHero.upsert({
    where: { id: 'default-hero' },
    update: {},
    create: {
      id: 'default-hero',
      headline: 'Generasi Qurani Berprestasi',
      subheadline: 'Membentuk karakter islami dan prestasi akademik yang unggul untuk masa depan gemilang',
      ctaPrimary: 'Daftar Sekarang',
      ctaSecondary: 'Pelajari Lebih Lanjut',
      isActive: true,
    },
  });

  // Landing Stats
  await prisma.landingStats.upsert({
    where: { id: 'default-stats' },
    update: {},
    create: {
      id: 'default-stats',
      students: 500,
      teachers: 25,
      years: 15,
      isActive: true,
    },
  });

  // Landing Features
  const features = [
    {
      title: 'Kurikulum Terintegrasi',
      description: 'Memadukan kurikulum nasional dengan nilai-nilai islami untuk pembelajaran holistik',
      icon: 'BookOpen',
      order: 1,
    },
    {
      title: 'Guru Berkualitas',
      description: 'Tenaga pendidik profesional dan berpengalaman dengan dedikasi tinggi',
      icon: 'Users',
      order: 2,
    },
    {
      title: 'Fasilitas Modern',
      description: 'Ruang kelas nyaman, perpustakaan lengkap, dan laboratorium komputer',
      icon: 'Building2',
      order: 3,
    },
    {
      title: 'Kegiatan Ekstrakurikuler',
      description: 'Beragam kegiatan untuk mengembangkan bakat dan minat siswa',
      icon: 'Trophy',
      order: 4,
    },
  ];

  for (const feature of features) {
    await prisma.landingFeature.create({
      data: feature,
    });
  }

  // Landing Programs
  const programs = [
    {
      title: 'Tahfidz Quran',
      description: 'Program menghafal Al-Quran dengan metode yang menyenangkan dan efektif',
      features: ['Target 2 Juz per tahun', 'Metode Ummi', 'Bimbingan intensif', 'Muroja\'ah rutin'],
      order: 1,
    },
    {
      title: 'Bahasa Arab & Inggris',
      description: 'Pembelajaran bahasa asing sejak dini untuk komunikasi global',
      features: ['Native speaker', 'Conversation class', 'Language lab', 'International curriculum'],
      order: 2,
    },
    {
      title: 'Sains & Teknologi',
      description: 'Mengembangkan kemampuan sains dan teknologi untuk masa depan',
      features: ['Laboratorium lengkap', 'Coding class', 'Robotika', 'Science project'],
      order: 3,
    },
  ];

  for (const program of programs) {
    await prisma.landingProgram.create({
      data: program,
    });
  }

  console.log('✅ Landing page CMS seeded');

  // Landing About
  await prisma.landingAbout.upsert({
    where: { id: 'default-about' },
    update: {},
    create: {
      id: 'default-about',
      title: 'Tentang MI Al-Amin',
      description: 'Madrasah Ibtidaiyah Al-Amin adalah lembaga pendidikan Islam yang berkomitmen untuk membentuk generasi Qurani yang berprestasi, berakhlak mulia, dan siap menghadapi tantangan masa depan.',
      vision: 'Menjadi madrasah ibtidaiyah terdepan yang menghasilkan generasi Qurani, berprestasi, dan berakhlak mulia.',
      mission: [
        'Menyelenggarakan pendidikan Islam yang berkualitas dan berkarakter',
        'Mengembangkan potensi akademik dan non-akademik siswa secara optimal',
        'Membentuk siswa yang hafal Al-Quran dan mengamalkan nilai-nilai Islam',
        'Menciptakan lingkungan belajar yang kondusif dan menyenangkan',
        'Membangun kerjasama yang baik dengan orang tua dan masyarakat',
      ],
      history: 'MI Al-Amin didirikan pada tahun 2011 dengan visi menjadi lembaga pendidikan Islam terdepan. Berawal dari 2 kelas dengan 40 siswa, kini telah berkembang menjadi madrasah dengan lebih dari 500 siswa dan 25 guru profesional. Prestasi demi prestasi terus diraih baik di bidang akademik maupun non-akademik.',
      isActive: true,
    },
  });

  console.log('✅ Landing about seeded');

  // Create Landing CTA
  await prisma.landingCTA.upsert({
    where: { id: 'default-cta' },
    update: {},
    create: {
      id: 'default-cta',
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
      isActive: true,
    },
  });

  console.log('✅ Landing CTA seeded');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@mialamin.sch.id / admin123');
  console.log('Guru: guru@mialamin.sch.id / admin123');
  console.log('Orang Tua: orangtua@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
