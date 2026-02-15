# 🚀 Panduan Deploy ke Vercel (Akun GitHub Berbeda)

## 📋 Persiapan

### 1. Setup Git & GitHub (5 menit)

```bash
# Cek status git
git status

# Jika belum init, jalankan:
git init

# Add semua file
git add .

# Commit
git commit -m "Initial commit - AL-AMIN School Management System"
```

### 2. Buat Repository di GitHub Akun Baru

1. Login ke GitHub akun yang berbeda
2. Buka: https://github.com/new
3. Isi form:
   - Repository name: `asms-alamin` atau `mialamin-school`
   - Description: `AL-AMIN School Management System`
   - Visibility: **Private** (recommended) atau Public
4. **JANGAN** centang "Initialize with README"
5. Klik "Create repository"

### 3. Push ke GitHub

```bash
# Ganti USERNAME dengan username GitHub Anda
git remote add origin https://github.com/USERNAME/asms-alamin.git

# Atau jika sudah ada remote, ganti dengan:
git remote set-url origin https://github.com/USERNAME/asms-alamin.git

# Push
git branch -M main
git push -u origin main
```

Jika diminta login:
- Username: username GitHub Anda
- Password: gunakan **Personal Access Token** (bukan password biasa)

**Cara buat Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Pilih scope: `repo` (full control)
4. Generate & copy token
5. Gunakan token sebagai password saat push

---

## 🗄️ Setup Database Supabase (5 menit)

### 1. Buat Akun Supabase

1. Buka: https://supabase.com
2. Klik "Start your project"
3. Login dengan GitHub (akun yang sama atau berbeda, bebas)

### 2. Buat Project

1. Klik "New Project"
2. Isi form:
   - Name: `asms-alamin`
   - Database Password: buat password kuat (SIMPAN!)
   - Region: **Southeast Asia (Singapore)**
3. Klik "Create new project"
4. Tunggu ~2 menit

### 3. Copy Connection String

1. Buka project → Settings → Database
2. Scroll ke "Connection string"
3. Pilih tab "URI"
4. Copy connection string
5. Ganti `[YOUR-PASSWORD]` dengan password yang Anda buat tadi

Contoh:
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

**SIMPAN connection string ini!** Akan digunakan di Vercel.

---

## 🚀 Deploy ke Vercel (5 menit)

### 1. Login ke Vercel

1. Buka: https://vercel.com
2. Klik "Sign Up" atau "Login"
3. Login dengan GitHub (akun yang sama dengan repository)

### 2. Import Project

1. Di dashboard Vercel, klik "Add New..." → "Project"
2. Klik "Import Git Repository"
3. Pilih repository `asms-alamin`
4. Jika tidak muncul, klik "Adjust GitHub App Permissions" dan berikan akses

### 3. Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (default)

**Build Command:** (biarkan default atau isi)
```
prisma generate && next build
```

**Output Directory:** `.next` (default)

**Install Command:** (biarkan default)
```
npm install
```

### 4. Environment Variables (PENTING!)

Klik "Environment Variables" dan tambahkan:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```
(paste connection string dari Supabase)

#### Variable 2: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: (generate random string)
```

Generate random string dengan cara:
- Windows: buka PowerShell dan jalankan:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```
- Atau gunakan: https://generate-secret.vercel.app/32

#### Variable 3: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
```
(ganti `your-project-name` dengan nama project Anda, atau isi dulu dengan `https://temp.vercel.app`, nanti update setelah deploy)

#### Variable 4-5: App Info (Optional)
```
Name: NEXT_PUBLIC_APP_NAME
Value: AL-AMIN School Management System

Name: NEXT_PUBLIC_SCHOOL_NAME
Value: Madrasah Ibtidaiyah Al-Amin
```

### 5. Deploy!

1. Klik "Deploy"
2. Tunggu ~2-3 menit
3. Jika sukses, akan muncul confetti 🎉

---

## 🗄️ Setup Database Schema (3 menit)

Setelah deploy sukses, kita perlu push schema ke database:

### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Generate Prisma Client
npx prisma generate

# Push schema
npx prisma db push

# Seed data
npx prisma db seed
```

### Option B: Via Local dengan Connection String

```bash
# Buat file .env.production
echo DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@..." > .env.production

# Generate Prisma Client
npx prisma generate

# Push schema
npx dotenv -e .env.production -- npx prisma db push

# Seed data
npx dotenv -e .env.production -- npx prisma db seed
```

---

## ✅ Update NEXTAUTH_URL

Setelah deploy sukses, Anda akan dapat URL seperti:
```
https://asms-alamin.vercel.app
```

Update environment variable:

1. Buka Vercel dashboard → Project → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Ganti dengan URL yang benar: `https://asms-alamin.vercel.app`
4. Save
5. Redeploy: Deployments → Latest → ... → Redeploy

---

## 🎉 SELESAI!

Website Anda sudah online di:
```
https://your-project-name.vercel.app
```

### Login Credentials:
```
Email: admin@mialamin.sch.id
Password: admin123
```

### Test:
1. Buka website
2. Klik "Login" atau langsung ke `/login`
3. Login dengan credentials di atas
4. Explore dashboard!

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
3. Test connection di Supabase dashboard → SQL Editor:
```sql
SELECT 1;
```

### Error: "NEXTAUTH_URL mismatch"

**Solusi:**
1. Update `NEXTAUTH_URL` dengan URL Vercel yang benar
2. Redeploy

### Database kosong (no data)

**Solusi:**
Run seed lagi:
```bash
vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma db seed
```

---

## 📊 Monitoring

### Vercel Dashboard
- Deployments: Lihat history deploy
- Analytics: Traffic & performance
- Logs: Runtime logs

### Supabase Dashboard
- Table Editor: Lihat data
- SQL Editor: Run queries
- Database: Monitor usage

---

## 🔄 Update Code

Setiap kali update code:

```bash
# Edit code
# ...

# Commit
git add .
git commit -m "Update: description"

# Push
git push

# Vercel akan auto-deploy!
```

---

## 💰 Biaya

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ SSL certificate
- ✅ Custom domain
- ✅ Analytics

### Supabase Free Tier:
- ✅ 500MB database
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users
- ✅ Daily backups (7 days)

**Total: Rp 0 (GRATIS!)** 🎉

---

## 🎯 Next Steps

### 1. Custom Domain (Optional)

**Gratis:**
- Freenom: .tk, .ml, .ga (gratis)
- Vercel: subdomain.vercel.app (gratis)

**Berbayar:**
- .sch.id: Rp 50.000/tahun
- .com: Rp 150.000/tahun

**Setup:**
1. Beli domain
2. Vercel → Settings → Domains
3. Add domain
4. Update DNS records
5. Done!

### 2. Update Data

Ganti data dummy dengan data real:
1. Buka Supabase → Table Editor
2. Edit data atau upload CSV
3. Atau via Prisma Studio:
```bash
vercel env pull .env.production
npx dotenv -e .env.production -- npx prisma studio
```

### 3. Backup Database

**Auto backup (Supabase):**
- Free tier: 7 days backup
- Pro tier: 30 days backup

**Manual backup:**
```bash
# Export database
pg_dump "postgresql://..." > backup.sql

# Import database
psql "postgresql://..." < backup.sql
```

---

## 📞 Support

### Dokumentasi:
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs

### Community:
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com

---

**Selamat! Website Anda sudah online! 🚀**

**Total waktu setup: ~15 menit**
**Total biaya: Rp 0 (GRATIS!)** 🎉
