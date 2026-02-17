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
    },
  });

  console.log('✅ Sample teacher created');

  // Create Sample Class
  const class1A = await prisma.class.create({
    data: {
      name: 'Kelas 1A',
      grade: 1,
      academicYearId: academicYear.id,
      teacherId: teacher.id,
      capacity: 30,
    },
  });

  console.log('✅ Sample class created');

  // Create Sample Parent
  const parentUser = await prisma.user.create({
    data: {
      email: 'orangtua@example.com',
      password: hashedPassword,
      name: 'Budi Santoso',
      role: 'PARENT',
      isActive: true,
    },
  });

  const parent = await prisma.parent.create({
    data: {
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
  const students = await Promise.all([
    prisma.student.create({
      data: {
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
    }),
    prisma.student.create({
      data: {
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
    }),
  ]);

  console.log('✅ Sample students created');

  // Assign students to class
  await Promise.all(
    students.map((student: any) =>
      prisma.classStudent.create({
        data: {
          classId: class1A.id,
          studentId: student.id,
        },
      })
    )
  );

  console.log('✅ Students assigned to class');

  // Create Sample SPMB Applicants
  await prisma.sPMBApplicant.createMany({
    data: [
      {
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
      {
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
    ],
  });

  console.log('✅ Sample SPMB applicants created');

  // Create Sample Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Pembukaan Tahun Ajaran Baru 2026/2027',
        content:
          'Dengan penuh syukur, kami mengumumkan pembukaan tahun ajaran baru 2026/2027. Kegiatan pembelajaran akan dimulai pada tanggal 15 Juli 2026.',
        academicYearId: academicYear.id,
        isPinned: true,
      },
      {
        title: 'Pendaftaran SPMB Gelombang 1',
        content:
          'Pendaftaran siswa baru gelombang 1 telah dibuka. Segera daftarkan putra-putri Anda untuk mendapatkan kesempatan terbaik.',
        academicYearId: academicYear.id,
        isPinned: true,
      },
    ],
  });

  console.log('✅ Sample announcements created');

  // Create System Config
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'school_name',
        value: 'Madrasah Ibtidaiyah Al-Amin',
        description: 'Nama sekolah',
      },
      {
        key: 'school_address',
        value: 'Jl. Pendidikan No. 123, Jakarta Selatan',
        description: 'Alamat sekolah',
      },
      {
        key: 'school_phone',
        value: '0812-3456-7890',
        description: 'Nomor telepon sekolah',
      },
      {
        key: 'school_email',
        value: 'info@mialamin.sch.id',
        description: 'Email sekolah',
      },
      {
        key: 'spp_amount',
        value: '250000',
        description: 'Nominal SPP per bulan',
      },
    ],
  });

  console.log('✅ System config created');

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
