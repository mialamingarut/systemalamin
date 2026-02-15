# 🚀 Quick Deploy ke Vercel

## ✅ Step 1: Code sudah di GitHub!
Repository: https://github.com/mialamingarut/systemalamin

---

## 📋 Step 2: Setup Supabase (5 menit)

### 1. Buka Supabase
- URL: https://supabase.com
- Login dengan GitHub (akun: mialamingarut)

### 2. Create New Project
- Klik "New Project"
- Name: `alamin-school`
- Database Password: **[BUAT PASSWORD KUAT & SIMPAN!]**
- Region: **Southeast Asia (Singapore)**
- Klik "Create new project"
- Tunggu ~2 menit

### 3. Copy Connection String
1. Buka project → Settings → Database
2. Scroll ke "Connection string"
3. Pilih tab **"URI"**
4. Copy connection string
5. Ganti `[YOUR-PASSWORD]` dengan password Anda

Contoh hasil:
```
postgresql://postgres.xxxxx:PASSWORD_ANDA@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**SIMPAN CONNECTION STRING INI!** ⚠️

---

## 🚀 Step 3: Deploy ke Vercel (5 menit)

### 1. Buka Vercel
- URL: https://vercel.com
- Login dengan GitHub (akun: mialamingarut)

### 2. Import Project
1. Klik "Add New..." → "Project"
2. Pilih repository: **systemalamin**
3. Klik "Import"

### 3. Configure Project

**Framework Preset:** Next.js ✅ (auto-detected)

**Root Directory:** `./` (default)

**Build Command:** (biarkan default atau isi)
```
prisma generate && next build
```

### 4. Environment Variables (PENTING!)

Klik "Environment Variables" dan tambahkan satu per satu:

#### ① DATABASE_URL
```
Name: DATABASE_URL
Value: [PASTE CONNECTION STRING DARI SUPABASE]
```

#### ② NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: [GENERATE RANDOM STRING]
```

**Generate random string:**
Buka PowerShell dan jalankan:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Atau gunakan: https://generate-secret.vercel.app/32

#### ③ NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://systemalamin.vercel.app
```
(Atau sesuaikan dengan nama project Anda)

#### ④ NEXT_PUBLIC_APP_NAME (Optional)
```
Name: NEXT_PUBLIC_APP_NAME
Value: AL-AMIN School Management System
```

#### ⑤ NEXT_PUBLIC_SCHOOL_NAME (Optional)
```
Name: NEXT_PUBLIC_SCHOOL_NAME
Value: Madrasah Ibtidaiyah Al-Amin
```

### 5. Deploy!
1. Klik **"Deploy"**
2. Tunggu ~2-3 menit
3. Jika sukses, akan muncul confetti 🎉

---

## 🗄️ Step 4: Setup Database (3 menit)

Setelah deploy sukses, kita perlu push schema ke database:

### Option A: Via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (jika belum)
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Pull environment variables
vercel env pull .env.production

# 5. Generate Prisma Client
npx prisma generate

# 6. Push schema
npx prisma db push

# 7. Seed data
npx prisma db seed
```

### Option B: Via Script (Lebih Mudah)

```bash
# 1. Pull environment variables
vercel env pull .env.production

# 2. Install dotenv-cli
npm install -g dotenv-cli

# 3. Run setup script
npm run setup:prod
```

---

## ✅ Step 5: Update NEXTAUTH_URL (Jika Perlu)

Jika URL Vercel Anda berbeda dari yang diisi di environment variable:

1. Copy URL Vercel Anda (misal: `https://systemalamin-abc123.vercel.app`)
2. Buka Vercel dashboard → Project → Settings → Environment Variables
3. Edit `NEXTAUTH_URL`
4. Ganti dengan URL yang benar
5. Save
6. Redeploy: Deployments → Latest → ... → Redeploy

---

## 🎉 SELESAI!

Website Anda sudah online di:
```
https://systemalamin.vercel.app
```
(atau URL yang Anda dapat dari Vercel)

### 🔐 Login Credentials:
```
Email: admin@mialamin.sch.id
Password: admin123
```

### 📝 Test Checklist:
- [ ] Buka website
- [ ] Landing page tampil dengan baik
- [ ] Klik "Login" atau buka `/login`
- [ ] Login dengan credentials di atas
- [ ] Dashboard tampil
- [ ] Cek menu Students, Teachers, Classes, dll
- [ ] Semua data dummy tampil

---

## 🔧 Troubleshooting

### Error: "Prisma Client not generated"
**Solusi:**
1. Vercel → Settings → Environment Variables
2. Pastikan `DATABASE_URL` sudah benar
3. Redeploy

### Error: "Database connection failed"
**Solusi:**
1. Cek connection string Supabase
2. Pastikan password benar (tidak ada `[YOUR-PASSWORD]`)
3. Test di Supabase dashboard → SQL Editor:
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

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: Lihat history deploy
- **Analytics**: Traffic & performance
- **Logs**: Runtime logs & errors

### Supabase Dashboard
- **Table Editor**: Lihat & edit data
- **SQL Editor**: Run queries
- **Database**: Monitor usage & performance

---

## 🔄 Update Code di Masa Depan

Setiap kali update code:

```bash
# 1. Edit code
# ...

# 2. Commit
git add .
git commit -m "Update: deskripsi perubahan"

# 3. Push
git push

# Vercel akan auto-deploy! 🚀
```

---

## 💰 Biaya

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ SSL certificate (HTTPS)
- ✅ Custom domain
- ✅ Analytics

### Supabase Free Tier:
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Daily backups (7 days retention)

**Total: Rp 0 (GRATIS!)** 🎉

---

## 🎯 Next Steps

### 1. Custom Domain (Optional)
- Vercel → Settings → Domains
- Add domain: `www.mialamin.sch.id`
- Update DNS records
- Done!

### 2. Update Data Real
- Ganti data dummy dengan data sekolah real
- Via Supabase Table Editor atau Prisma Studio

### 3. Backup Database
- Supabase: Auto backup daily (7 days)
- Manual: Export via SQL Editor

---

## 📞 Support

### Dokumentasi:
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs

### Video Tutorial:
- Deploy Next.js ke Vercel: https://www.youtube.com/watch?v=...
- Setup Supabase: https://www.youtube.com/watch?v=...

---

**Selamat! Website sekolah sudah online! 🚀**

**Repository:** https://github.com/mialamingarut/systemalamin
**Website:** https://systemalamin.vercel.app (atau URL Anda)

**Total waktu setup: ~15 menit**
**Total biaya: Rp 0 (GRATIS!)** 🎉
