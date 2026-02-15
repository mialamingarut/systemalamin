# AL-AMIN School Management System (ASMS)

Sistem Manajemen Sekolah Modern untuk **Madrasah Ibtidaiyah Al-Amin**

## 🌟 Fitur Utama

### 1. Landing Page Premium
- ✨ Design modern dengan animasi smooth (Framer Motion)
- 🎨 Identitas kuat MI Al-Amin dengan tema islami elegan
- 🎯 Micro-interactions dan visual storytelling
- 📱 Fully responsive untuk semua device
- ⚡ Performance optimized dengan Next.js 14

### 2. Sistem Internal (Dashboard)
- 📊 Dashboard analytics real-time
- 👥 Manajemen data siswa & guru
- 📚 Manajemen kelas & tahun ajaran
- 💰 Sistem keuangan & pembayaran SPP
- 📝 Modul SPMB (Pendaftaran Siswa Baru)
- 📅 Kalender akademik & pengumuman
- 🔐 Role-based access control (Super Admin, Admin, Guru, Orang Tua)

### 3. Modul SPMB
- 📋 Formulir pendaftaran online multi-step
- 📤 Upload dokumen (foto, akta, KK)
- 🔢 Nomor pendaftaran otomatis
- ✅ Sistem verifikasi & seleksi
- 📊 Dashboard ranking calon siswa
- 📄 Generate surat kelulusan PDF
- 🔍 Cek kelulusan online

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animasi smooth
- **Lucide React** - Icon library modern

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database management
- **PostgreSQL** - Database relational
- **NextAuth.js** - Authentication

### Tools
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **XLSX** - Excel import/export
- **Zod** - Schema validation

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm atau yarn

### Setup Database

1. Install PostgreSQL dan buat database:
```bash
createdb asms_alamin
```

2. Copy environment variables:
```bash
copy .env.example .env
```

3. Edit `.env` dan sesuaikan DATABASE_URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/asms_alamin"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Install Dependencies

```bash
npm install
```

### Setup Database Schema

```bash
npm run db:push
```

### Seed Database (Data Dummy)

```bash
npm run db:seed
```

## 🚀 Development

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📱 Akun Login Default

Setelah seeding, gunakan akun berikut:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mialamin.sch.id | admin123 |
| Guru | guru@mialamin.sch.id | admin123 |
| Orang Tua | orangtua@example.com | admin123 |

## 🏗️ Struktur Folder

```
asms-alamin/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── (landing)/     # Landing page
│   │   ├── dashboard/     # Dashboard admin
│   │   ├── spmb/          # Modul SPMB
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── landing/       # Landing components
│   │   └── dashboard/     # Dashboard components
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       ├── auth.ts        # NextAuth config
│       └── utils.ts       # Utility functions
├── public/                # Static assets
└── package.json
```

## 🗄️ Database Schema

### Tabel Utama:
- **users** - User authentication & authorization
- **students** - Data siswa
- **teachers** - Data guru
- **parents** - Data orang tua
- **classes** - Data kelas
- **academic_years** - Tahun ajaran
- **spmb_applicants** - Pendaftar SPMB
- **invoices** - Tagihan pembayaran
- **announcements** - Pengumuman
- **activities** - Kegiatan sekolah
- **activity_logs** - Audit log
- **system_config** - Konfigurasi sistem

### Relasi:
- User → Teacher (1:1)
- User → Parent (1:1)
- Parent → Students (1:N)
- Class → Students (N:M via ClassStudent)
- AcademicYear → Classes (1:N)
- Teacher → Classes (1:N)

## 🎨 Design System

### Color Palette:
- **Primary**: Emerald Green (#059669 - #10b981)
- **Gold**: Accent (#eab308 - #ca8a04)
- **Background**: White & Soft Gray
- **Text**: Gray scale

### Typography:
- **Display**: Poppins (Headings)
- **Body**: Inter (Content)

### Components:
- Glass morphism cards
- Smooth animations
- Rounded corners (2xl)
- Soft shadows
- Gradient accents

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ CSRF protection
- ✅ File upload validation
- ✅ Activity logging
- ✅ Soft delete (data tidak benar-benar dihapus)

## 📊 Modul Sistem

### 1. Dashboard
- Statistik real-time
- Grafik pembayaran
- Aktivitas terbaru
- Quick actions

### 2. Data Siswa
- CRUD siswa
- Import/export Excel
- Upload foto
- Riwayat kelas
- Status aktif/non-aktif

### 3. Data Guru
- CRUD guru
- Mata pelajaran
- Jadwal mengajar
- Riwayat karir

### 4. Kelas
- Manajemen kelas per tahun ajaran
- Assign wali kelas
- Daftar siswa per kelas
- Kapasitas kelas

### 5. SPMB
- Pendaftaran online
- Upload dokumen
- Verifikasi data
- Input nilai tes
- Ranking otomatis
- Generate surat kelulusan
- Cek kelulusan online

### 6. Keuangan
- Generate tagihan SPP otomatis
- Input pembayaran
- Status pembayaran (Lunas/Belum/Terlambat)
- Laporan keuangan bulanan
- Export laporan

### 7. Akademik
- Kalender akademik
- Pengumuman
- Dokumentasi kegiatan
- Upload foto kegiatan

## 🚀 Deployment

### Vercel (Recommended - Gratis)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Database Hosting

**Option 1: Supabase (Gratis)**
- Daftar di [Supabase](https://supabase.com)
- Buat project PostgreSQL
- Copy connection string ke `DATABASE_URL`

**Option 2: Railway (Murah)**
- Daftar di [Railway](https://railway.app)
- Deploy PostgreSQL
- Copy connection string

### VPS (Manual)

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📈 Roadmap

### Phase 1 (Current) ✅
- Landing page premium
- Dashboard admin
- CRUD siswa, guru, kelas
- Modul SPMB
- Sistem keuangan dasar

### Phase 2 (Future)
- [ ] Rapor digital
- [ ] Absensi online
- [ ] E-learning module
- [ ] Parent mobile app
- [ ] WhatsApp notification
- [ ] Payment gateway integration

### Phase 3 (Advanced)
- [ ] Multi-school support (Yayasan)
- [ ] SMP/SMA module
- [ ] AI-powered analytics
- [ ] Advanced reporting

## 🤝 Kontribusi

Sistem ini dibangun dengan arsitektur modular dan clean code, sehingga mudah dikembangkan.

### Development Guidelines:
1. Gunakan TypeScript untuk type safety
2. Follow Next.js best practices
3. Gunakan Prisma untuk database operations
4. Implement proper error handling
5. Add activity logs untuk audit trail
6. Test sebelum commit

## 📝 License

Copyright © 2026 MI Al-Amin. All rights reserved.

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: info@mialamin.sch.id
- Phone: 0812-3456-7890

---

**Built with ❤️ for better education**
