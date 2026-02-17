# Checklist Deployment ke Vercel

## ✅ Persiapan Sebelum Deploy

### 1. Database Setup (Supabase PostgreSQL)
- [x] Database sudah dibuat di Supabase
- [x] Connection string sudah ada di `.env.production`
- [ ] **PENTING**: Jalankan migrasi database di production

```bash
# Set environment variable untuk production database
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Jalankan migrasi
npx prisma migrate deploy

# Seed data awal (opsional, untuk data demo)
npx prisma db seed
```

### 2. Environment Variables
File `.env.vercel` sudah berisi semua variable yang diperlukan:

```
DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:C8Mo7Vas9PmGSQH0@db.qjliveyhaqaywhyxnakj.supabase.co:5432/postgres"
NEXTAUTH_URL="https://madrasahalamin.vercel.app"
NEXTAUTH_SECRET="OBsTc53SKNX0Vz9jiegQ7AqmyIZfhFCx"
NEXT_PUBLIC_APP_NAME="AL-AMIN School Management System"
NEXT_PUBLIC_SCHOOL_NAME="Madrasah Ibtidaiyah Al-Amin"
```

### 3. Build Test
- [x] Build lokal berhasil (`npm run build`)
- [x] Tidak ada TypeScript errors
- [x] Tidak ada linting errors

## 🚀 Langkah Deployment ke Vercel

### Opsi 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (jika belum):
```bash
npm install -g vercel
```

2. **Login ke Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
# Deploy ke preview
vercel

# Deploy ke production
vercel --prod
```

### Opsi 2: Deploy via Vercel Dashboard

1. **Push ke GitHub** (jika belum):
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

2. **Import Project di Vercel**:
   - Buka https://vercel.com/new
   - Import repository GitHub Anda
   - Vercel akan auto-detect Next.js

3. **Configure Environment Variables**:
   - Di Vercel Dashboard → Settings → Environment Variables
   - Copy semua variable dari `.env.vercel`
   - Paste satu per satu

4. **Deploy**:
   - Klik "Deploy"
   - Tunggu proses build selesai

## ⚠️ PENTING: Setelah Deploy

### 1. Setup Database di Production
Setelah deploy pertama kali, Anda HARUS menjalankan migrasi database:

**Via Vercel CLI**:
```bash
# Set production database URL
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Seed initial data (admin user, etc.)
npx prisma db seed
```

**Atau via Supabase SQL Editor**:
- Buka Supabase Dashboard
- Jalankan SQL migrations secara manual

### 2. Test Login
Setelah database di-setup, test login dengan:
- Email: `admin@mialamin.sch.id`
- Password: `admin123`

### 3. Verifikasi Fitur
- [ ] Landing page loading dengan baik
- [ ] Login berfungsi
- [ ] Dashboard accessible
- [ ] CRUD operations berfungsi
- [ ] Export Excel/PDF berfungsi
- [ ] Upload foto berfungsi
- [ ] Notifikasi berfungsi

## 🔧 Troubleshooting

### Error: "Cannot find module for page"
**Solusi**: Clear build cache dan rebuild
```bash
vercel --force
```

### Error: "Database connection failed"
**Solusi**: 
1. Cek environment variables di Vercel Dashboard
2. Pastikan DATABASE_URL benar
3. Cek Supabase database masih aktif

### Error: "NEXTAUTH_SECRET is not set"
**Solusi**: 
1. Tambahkan NEXTAUTH_SECRET di Vercel environment variables
2. Redeploy

### Error: Prisma Client not generated
**Solusi**: 
1. Vercel sudah dikonfigurasi untuk run `prisma generate` di `vercel.json`
2. Jika masih error, tambahkan di package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

## 📊 Monitoring

Setelah deploy, monitor:
1. **Vercel Analytics**: Lihat traffic dan performance
2. **Vercel Logs**: Cek error logs jika ada masalah
3. **Supabase Dashboard**: Monitor database usage

## 🎯 URL Production

Setelah deploy, aplikasi akan tersedia di:
- **Production**: https://madrasahalamin.vercel.app
- **Preview**: https://madrasahalamin-[hash].vercel.app (untuk setiap commit)

## 📝 Catatan Penting

1. **Database**: Menggunakan PostgreSQL di Supabase (bukan SQLite)
2. **Schema**: Sudah ada di `prisma/schema-postgresql.prisma`
3. **Region**: Deployed di Singapore (sin1) untuk latency rendah
4. **Build Command**: `prisma generate && next build`
5. **Node Version**: 18.x (default Vercel)

## ✅ Siap Deploy?

Jika semua checklist di atas sudah dipenuhi, Anda siap deploy ke Vercel!

**Rekomendasi**:
1. Deploy ke preview dulu untuk testing
2. Jika semua OK, deploy ke production
3. Setup custom domain (opsional)

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma on Vercel: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
