# 🚀 DEPLOY SEKARANG - Semua Sudah Siap!

## ✅ Yang Sudah Selesai:
- ✅ Code di GitHub: https://github.com/mialamingarut/systemalamin
- ✅ Database Supabase sudah dibuat
- ✅ Environment variables sudah disiapkan

---

## 🚀 LANGKAH 1: Deploy ke Vercel (5 menit)

### 1. Buka Vercel
- URL: https://vercel.com
- Login dengan GitHub (akun: mialamingarut)

### 2. Import Project
1. Klik **"Add New..."** → **"Project"**
2. Cari dan pilih repository: **"systemalamin"**
3. Klik **"Import"**

### 3. Configure Project

**Framework Preset:** Next.js ✅ (sudah auto-detect)

**Root Directory:** `./` (biarkan default)

**Build Command:** (biarkan default atau isi)
```
prisma generate && next build
```

**Install Command:** (biarkan default)
```
npm install
```

### 4. Environment Variables

Klik **"Environment Variables"** dan tambahkan 5 variable ini:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
```

#### Variable 2: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: OBsTc53SKNX0Vz9jiegQ7AqmyIZfhFCx
```

#### Variable 3: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://siakadalamin.vercel.app
```

#### Variable 4: NEXT_PUBLIC_APP_NAME
```
Name: NEXT_PUBLIC_APP_NAME
Value: AL-AMIN School Management System
```

#### Variable 5: NEXT_PUBLIC_SCHOOL_NAME
```
Name: NEXT_PUBLIC_SCHOOL_NAME
Value: Madrasah Ibtidaiyah Al-Amin
```

### 5. Deploy!
1. Klik **"Deploy"**
2. Tunggu ~2-3 menit
3. Jika sukses, akan muncul confetti 🎉

---

## 🗄️ LANGKAH 2: Setup Database (3 menit)

Setelah deploy sukses di Vercel, jalankan command ini di terminal lokal:

### Install Tools (Jika Belum)
```bash
npm install -g vercel dotenv-cli
```

### Login & Link Project
```bash
# Login ke Vercel
vercel login

# Link project (pilih systemalamin)
vercel link
```

### Pull Environment Variables
```bash
vercel env pull .env.production
```

### Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx dotenv -e .env.production -- npx prisma db push

# Seed data dummy
npx dotenv -e .env.production -- npx prisma db seed
```

---

## ✅ LANGKAH 3: Verifikasi

### 1. Cek URL Vercel
Setelah deploy, Anda akan dapat URL seperti:
```
https://systemalamin.vercel.app
```
atau
```
https://systemalamin-xxx.vercel.app
```

### 2. Update NEXTAUTH_URL (Jika Berbeda)
Jika URL Anda berbeda dari `https://systemalamin.vercel.app`:

1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Ganti dengan URL yang benar
4. Save
5. Redeploy: Deployments → Latest → ... → Redeploy

### 3. Test Website
1. Buka URL Vercel Anda
2. Landing page harus tampil dengan baik
3. Klik **"Login"** atau buka `/login`
4. Login dengan:
   ```
   Email: admin@mialamin.sch.id
   Password: admin123
   ```
5. Dashboard harus tampil
6. Cek semua menu (Students, Teachers, Classes, dll)

---

## 🎉 SELESAI!

Website Anda sudah online! 🚀

### 📝 Informasi Penting:

**Repository GitHub:**
```
https://github.com/mialamingarut/systemalamin
```

**Website URL:**
```
https://systemalamin.vercel.app
(atau URL yang Anda dapat dari Vercel)
```

**Login Credentials:**
```
Email: admin@mialamin.sch.id
Password: admin123
```

**Database:**
```
Supabase Project: qjliveyhaqaywhyxnakj
Region: Singapore
```

---

## 🔄 Update Code di Masa Depan

Setiap kali Anda update code:

```bash
# 1. Edit code di local
# ...

# 2. Commit & push
git add .
git commit -m "Update: deskripsi perubahan"
git push

# 3. Vercel akan auto-deploy! 🚀
```

---

## 🔧 Troubleshooting

### Error: "Prisma Client not generated"
**Solusi:**
```bash
vercel env pull .env.production
npx prisma generate
npx dotenv -e .env.production -- npx prisma db push
```

### Error: "Database connection failed"
**Solusi:**
1. Cek connection string di Vercel environment variables
2. Pastikan password benar: `C8Mo7Vas9PmGSQH0`
3. Test di Supabase SQL Editor:
```sql
SELECT 1;
```

### Error: "NEXTAUTH_URL mismatch"
**Solusi:**
1. Update `NEXTAUTH_URL` dengan URL Vercel yang benar
2. Redeploy

### Database kosong (no data)
**Solusi:**
```bash
vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma db seed
```

### Error saat seed: "PrismaClient not found"
**Solusi:**
```bash
npx prisma generate
npx dotenv -e .env.production -- npx prisma db seed
```

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: https://vercel.com/mialamingarut/systemalamin
- **Analytics**: Lihat traffic & performance
- **Logs**: Runtime logs & errors

### Supabase Dashboard
- **Table Editor**: https://supabase.com/dashboard/project/qjliveyhaqaywhyxnakj/editor
- **SQL Editor**: Run queries
- **Database**: Monitor usage

---

## 💰 Biaya

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ SSL certificate (HTTPS)
- ✅ Custom domain support
- ✅ Analytics

### Supabase Free Tier:
- ✅ 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Daily backups (7 days)

**Total: Rp 0 (GRATIS!)** 🎉

---

## 🎯 Next Steps

### 1. Custom Domain (Optional)
Jika ingin pakai domain sendiri (misal: www.mialamin.sch.id):

1. Vercel → Settings → Domains
2. Add domain
3. Update DNS records di domain provider
4. Done!

### 2. Update Data Real
Ganti data dummy dengan data sekolah real:
- Via Supabase Table Editor
- Atau via Prisma Studio:
```bash
vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma studio
```

### 3. Monitoring & Analytics
- Setup Vercel Analytics untuk tracking visitors
- Setup error monitoring (Sentry, LogRocket, dll)

---

## 📞 Support

### Dokumentasi:
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

### Community:
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com

---

**Selamat! Website sekolah sudah online! 🎉**

**Total waktu setup: ~10 menit**
**Total biaya: Rp 0 (GRATIS!)** 🚀
