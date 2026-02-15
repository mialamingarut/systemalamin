# 🚀 START HERE - Quick Setup

## ✅ Status: Dependencies Installed & Server Running!

Development server sudah berjalan di: **http://localhost:3000**

## 📋 Next Steps

### 1. Setup Database (WAJIB!)

Sebelum bisa login, Anda harus setup database terlebih dahulu:

```bash
# Buat database PostgreSQL
createdb asms_alamin

# Copy environment file
copy .env.example .env

# Edit .env dan sesuaikan DATABASE_URL
notepad .env
```

Edit `DATABASE_URL` di `.env`:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/asms_alamin"
```

### 2. Push Database Schema

```bash
npm run db:push
```

### 3. Seed Data (Data Dummy)

```bash
npm run db:seed
```

### 4. Akses Aplikasi

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

### 5. Login Credentials

Setelah seeding, gunakan:

**Super Admin:**
```
Email: admin@mialamin.sch.id
Password: admin123
```

**Guru:**
```
Email: guru@mialamin.sch.id
Password: admin123
```

**Orang Tua:**
```
Email: orangtua@example.com
Password: admin123
```

## 🎯 Current Status

✅ Dependencies installed
✅ TypeScript configured
✅ Development server running
⏳ Database setup (belum)
⏳ Data seeding (belum)

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Panduan lengkap 5 menit
- [README.md](README.md) - Dokumentasi utama
- [API.md](API.md) - API documentation
- [DATABASE.md](DATABASE.md) - Database schema
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

## 🛠️ Useful Commands

```bash
# Development server
npm run dev

# Build production
npm run build

# Start production
npm start

# Database studio (GUI)
npm run db:studio

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint
```

## ⚠️ Troubleshooting

### Error: Cannot connect to database
- Pastikan PostgreSQL running
- Cek `DATABASE_URL` di `.env`
- Test: `psql -U postgres`

### Error: Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Prisma Client not generated
```bash
npx prisma generate
```

## 🎉 What's Next?

1. ✅ Setup database (ikuti step 1-3 di atas)
2. 🎨 Explore landing page
3. 🔐 Login ke dashboard
4. 📊 Explore semua fitur
5. 🚀 Deploy ke production (baca DEPLOYMENT.md)

## 💡 Tips

- Development server auto-reload saat save file
- Gunakan `npm run db:studio` untuk GUI database
- Baca FEATURES.md untuk daftar fitur lengkap
- Cek API.md untuk dokumentasi API

## 📞 Need Help?

- Email: support@mialamin.sch.id
- GitHub Issues: [Create Issue](https://github.com/username/asms-alamin/issues)
- Documentation: Baca file .md di root folder

---

**Happy Coding! 🚀**
