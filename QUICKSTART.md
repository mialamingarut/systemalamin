# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan AL-AMIN School Management System dalam 5 menit!

## 🎯 Prerequisites

Pastikan sudah terinstall:
- ✅ Node.js 18+ ([Download](https://nodejs.org))
- ✅ PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- ✅ Git ([Download](https://git-scm.com/downloads))

## 🚀 Installation (5 Menit)

### Step 1: Clone Repository (30 detik)

```bash
git clone https://github.com/username/asms-alamin.git
cd asms-alamin
```

### Step 2: Install Dependencies (2 menit)

```bash
npm install
```

### Step 3: Setup Database (1 menit)

**Windows:**
```bash
# Buka PostgreSQL command prompt
createdb asms_alamin
```

**Mac/Linux:**
```bash
# Buka terminal
createdb asms_alamin
```

### Step 4: Configure Environment (30 detik)

```bash
# Copy environment template
copy .env.example .env

# Edit .env file
notepad .env
```

Ubah `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/asms_alamin"
```

Ganti `password` dengan password PostgreSQL Anda.

### Step 5: Setup Database Schema (30 detik)

```bash
npm run db:push
```

### Step 6: Seed Data (30 detik)

```bash
npm run db:seed
```

### Step 7: Run Development Server (10 detik)

```bash
npm run dev
```

## 🎉 Done!

Buka browser dan akses:
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Login**: http://localhost:3000/login

## 🔑 Login Credentials

Gunakan akun berikut untuk login:

### Super Admin
```
Email: admin@mialamin.sch.id
Password: admin123
```

### Guru
```
Email: guru@mialamin.sch.id
Password: admin123
```

### Orang Tua
```
Email: orangtua@example.com
Password: admin123
```

## 📱 Explore Features

### 1. Landing Page (/)
- Hero section dengan animasi
- Profil madrasah
- Program unggulan
- Statistik sekolah
- Galeri kegiatan
- Section SPMB
- Testimoni

### 2. Dashboard (/dashboard)
- Overview statistics
- Grafik pembayaran
- Aktivitas terbaru

### 3. Data Siswa (/dashboard/students)
- List siswa
- Tambah siswa baru
- Edit data siswa
- Upload foto
- Import/export Excel

### 4. Data Guru (/dashboard/teachers)
- List guru
- Tambah guru baru
- Edit data guru
- Assign mata pelajaran

### 5. Kelas (/dashboard/classes)
- List kelas
- Buat kelas baru
- Assign siswa ke kelas
- Assign wali kelas

### 6. SPMB (/dashboard/spmb)
- List pendaftar
- Verifikasi data
- Input nilai tes
- Ranking otomatis
- Generate surat kelulusan

### 7. Keuangan (/dashboard/finance)
- Generate tagihan SPP
- Input pembayaran
- Laporan keuangan
- Export laporan

### 8. Akademik (/dashboard/academic)
- Pengumuman
- Kegiatan sekolah
- Kalender akademik

## 🛠️ Development Tools

### Prisma Studio (Database GUI)

```bash
npm run db:studio
```

Buka: http://localhost:5555

### View Logs

```bash
# Terminal akan menampilkan logs real-time
# Ctrl+C untuk stop server
```

## 📝 Common Tasks

### Tambah Data Siswa Baru

1. Login sebagai Admin
2. Klik "Data Siswa" di sidebar
3. Klik tombol "Tambah Siswa"
4. Isi form lengkap
5. Upload foto (opsional)
6. Klik "Simpan"

### Generate Tagihan SPP

1. Login sebagai Admin
2. Klik "Keuangan" di sidebar
3. Klik "Generate Tagihan"
4. Pilih bulan dan tahun
5. Set nominal SPP
6. Klik "Generate"

### Input Pembayaran

1. Klik "Keuangan" → "Pembayaran"
2. Cari siswa atau scan invoice
3. Input nominal pembayaran
4. Pilih metode pembayaran
5. Klik "Simpan"

### Verifikasi Pendaftar SPMB

1. Klik "SPMB" di sidebar
2. Pilih pendaftar
3. Review dokumen
4. Klik "Verifikasi" atau "Tolak"
5. Tambahkan catatan (opsional)

## 🐛 Troubleshooting

### Error: Database connection failed

**Solusi:**
1. Pastikan PostgreSQL running
2. Cek `DATABASE_URL` di `.env`
3. Test connection: `psql -U postgres`

### Error: Port 3000 already in use

**Solusi:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: Module not found

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Error: Prisma Client not generated

**Solusi:**
```bash
npx prisma generate
```

## 🔄 Reset Database

Jika ingin reset database ke kondisi awal:

```bash
# Drop database
dropdb asms_alamin

# Create database
createdb asms_alamin

# Push schema
npm run db:push

# Seed data
npm run db:seed
```

## 📚 Next Steps

Setelah berhasil menjalankan aplikasi:

1. ✅ Baca [README.md](README.md) untuk overview lengkap
2. ✅ Baca [FEATURES.md](FEATURES.md) untuk daftar fitur
3. ✅ Baca [API.md](API.md) untuk dokumentasi API
4. ✅ Baca [DATABASE.md](DATABASE.md) untuk struktur database
5. ✅ Baca [DEPLOYMENT.md](DEPLOYMENT.md) untuk deploy ke production

## 🎓 Learning Resources

### Next.js
- [Next.js Tutorial](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

### Prisma
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

## 💡 Tips & Tricks

### Hot Reload
Next.js automatically reloads when you save files. No need to restart server!

### Keyboard Shortcuts
- `Ctrl + C` - Stop development server
- `Ctrl + Shift + P` - VS Code command palette
- `Ctrl + /` - Toggle comment

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- ESLint
- Prettier

### Chrome DevTools
- `F12` - Open DevTools
- `Ctrl + Shift + C` - Inspect element
- `Ctrl + Shift + J` - Console

## 🆘 Getting Help

### Documentation
- [README.md](README.md) - Main documentation
- [API.md](API.md) - API reference
- [DATABASE.md](DATABASE.md) - Database schema
- [FEATURES.md](FEATURES.md) - Feature list

### Community
- GitHub Issues: [Report Bug](https://github.com/username/asms-alamin/issues)
- GitHub Discussions: [Ask Question](https://github.com/username/asms-alamin/discussions)
- Email: support@mialamin.sch.id

### Video Tutorials (Coming Soon)
- Installation & Setup
- Basic Usage
- Advanced Features
- Deployment Guide

## ✅ Checklist

Pastikan semua langkah sudah dilakukan:

- [ ] Node.js terinstall
- [ ] PostgreSQL terinstall
- [ ] Repository di-clone
- [ ] Dependencies terinstall
- [ ] Database dibuat
- [ ] Environment configured
- [ ] Database schema di-push
- [ ] Data di-seed
- [ ] Development server running
- [ ] Bisa akses http://localhost:3000
- [ ] Bisa login ke dashboard

## 🎊 Congratulations!

Anda berhasil menjalankan AL-AMIN School Management System!

Sekarang Anda bisa:
- ✨ Explore semua fitur
- 🎨 Customize sesuai kebutuhan
- 🚀 Deploy ke production
- 🤝 Contribute ke project

---

**Happy Coding! 🚀**

Jika ada pertanyaan, jangan ragu untuk:
- Buka issue di GitHub
- Email ke support@mialamin.sch.id
- Baca dokumentasi lengkap
