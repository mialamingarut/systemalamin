# 🧪 Deploy untuk Testing Awal (Gratis & Murah)

Panduan lengkap deploy AL-AMIN School Management System untuk testing dengan budget minimal atau gratis!

## 🎯 Rekomendasi Platform Testing

### ⭐ PILIHAN TERBAIK: 100% GRATIS!

| Platform | Biaya | Setup | Kecepatan | Database | Rekomendasi |
|----------|-------|-------|-----------|----------|-------------|
| **Vercel + Supabase** | **Rp 0** | ⭐⭐⭐⭐⭐ Mudah | ⚡ Sangat Cepat | PostgreSQL 500MB | ✅ **TERBAIK!** |
| **Netlify + PlanetScale** | **Rp 0** | ⭐⭐⭐⭐ Mudah | ⚡ Cepat | MySQL 5GB | ✅ Bagus |
| **Railway** | **$5/bulan** | ⭐⭐⭐⭐⭐ Sangat Mudah | ⚡ Cepat | PostgreSQL included | ✅ Paling Mudah |
| **Render** | **Rp 0** | ⭐⭐⭐ Sedang | 🐌 Lambat (free tier) | PostgreSQL 1GB | ⚠️ Lambat |

---

## 🚀 OPTION 1: Vercel + Supabase (GRATIS SELAMANYA!)

### ✅ Kelebihan:
- 100% GRATIS selamanya
- Setup 10 menit
- Auto-deploy dari GitHub
- SSL otomatis
- CDN global
- Perfect untuk Next.js
- Database PostgreSQL 500MB gratis

### 📋 Langkah-langkah:

#### 1. Persiapan (5 menit)

```bash
# 1. Buat akun (gratis):
# - GitHub: https://github.com/signup
# - Vercel: https://vercel.com/signup (login dengan GitHub)
# - Supabase: https://supabase.com (login dengan GitHub)

# 2. Install Vercel CLI
npm i -g vercel

# 3. Login
vercel login
```

#### 2. Setup Database Supabase (3 menit)

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Klik "New Project"**
3. **Isi form:**
   - Name: `asms-alamin`
   - Database Password: (buat password, SIMPAN!)
   - Region: `Southeast Asia (Singapore)`
4. **Klik "Create new project"** (tunggu ~2 menit)
5. **Copy Connection String:**
   - Buka Settings → Database
   - Copy "Connection string" (URI mode)
   - Ganti `[YOUR-PASSWORD]` dengan password Anda
   - Format: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`

#### 3. Update Schema untuk PostgreSQL (2 menit)

```bash
# Di local, copy schema PostgreSQL
copy prisma\schema-postgresql.prisma prisma\schema.prisma

# Update .env
# Ganti DATABASE_URL dengan connection string Supabase
```

#### 4. Push ke GitHub (2 menit)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Buat repo di GitHub: https://github.com/new
# Nama: asms-alamin

# Push
git remote add origin https://github.com/USERNAME/asms-alamin.git
git branch -M main
git push -u origin main
```

#### 5. Deploy ke Vercel (3 menit)

1. **Buka Vercel**: https://vercel.com/new
2. **Import repository** `asms-alamin`
3. **Configure:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Environment Variables** (klik "Add"):
   ```env
   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your-random-secret-here
   NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
   NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
   ```
   
   Generate secret:
   ```bash
   openssl rand -base64 32
   ```

5. **Klik "Deploy"** (tunggu ~2 menit)

#### 6. Setup Database (2 menit)

```bash
# Pull environment variables
vercel env pull .env.production

# Push schema
npx prisma db push

# Seed data
npx prisma db seed
```

#### 7. ✅ SELESAI!

Website Anda sudah online di:
```
https://your-project.vercel.app
```

Login:
```
Email: admin@mialamin.sch.id
Password: admin123
```

**Total waktu: ~15 menit**
**Total biaya: Rp 0 (GRATIS!)**

---

## 🚂 OPTION 2: Railway (Paling Mudah, $5/bulan)

### ✅ Kelebihan:
- Setup paling mudah (5 menit!)
- Database included
- Auto-deploy
- $5/bulan (~Rp 75.000)
- Trial $5 gratis

### 📋 Langkah-langkah:

#### 1. Deploy (5 menit total!)

1. **Buka Railway**: https://railway.app
2. **Login dengan GitHub**
3. **Klik "New Project"**
4. **Pilih "Deploy from GitHub repo"**
5. **Pilih repository** `asms-alamin`
6. **Klik "Add PostgreSQL"** (database otomatis dibuat!)
7. **Add Environment Variables:**
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXTAUTH_URL=https://your-app.railway.app
   NEXTAUTH_SECRET=generate-random-string
   NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
   NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
   ```
8. **Deploy otomatis!**

#### 2. Setup Database

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Push schema
railway run npx prisma db push

# Seed
railway run npx prisma db seed
```

#### 3. ✅ SELESAI!

Website online di:
```
https://your-app.railway.app
```

**Total waktu: ~10 menit**
**Total biaya: $5/bulan (~Rp 75.000)**
**Trial: $5 gratis untuk testing**

---

## 🌐 OPTION 3: Netlify + PlanetScale (GRATIS)

### ✅ Kelebihan:
- 100% GRATIS
- Database MySQL 5GB
- Good performance

### 📋 Langkah-langkah:

#### 1. Setup PlanetScale (5 menit)

1. **Buka PlanetScale**: https://planetscale.com
2. **Login dengan GitHub**
3. **Create database**: `asms-alamin`
4. **Copy connection string**

#### 2. Deploy ke Netlify (5 menit)

1. **Buka Netlify**: https://netlify.com
2. **Import dari GitHub**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables**
5. **Deploy**

**Total waktu: ~15 menit**
**Total biaya: Rp 0 (GRATIS!)**

---

## 💻 OPTION 4: VPS Murah (Full Control)

### Platform VPS Murah:

| Provider | Harga/Bulan | Spesifikasi | Link |
|----------|-------------|-------------|------|
| **Contabo** | **€4 (~Rp 60.000)** | 4 vCPU, 8GB RAM, 200GB SSD | https://contabo.com |
| **Hetzner** | **€4.5 (~Rp 70.000)** | 2 vCPU, 4GB RAM, 40GB SSD | https://hetzner.com |
| **DigitalOcean** | **$6 (~Rp 90.000)** | 1 vCPU, 1GB RAM, 25GB SSD | https://digitalocean.com |
| **Vultr** | **$6 (~Rp 90.000)** | 1 vCPU, 1GB RAM, 25GB SSD | https://vultr.com |

### Setup VPS (30 menit):

```bash
# 1. SSH ke VPS
ssh root@your-vps-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Clone repository
git clone https://github.com/USERNAME/asms-alamin.git
cd asms-alamin

# 5. Install dependencies
npm install

# 6. Setup database
sudo -u postgres psql
CREATE DATABASE asms_alamin;
CREATE USER asms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE asms_alamin TO asms_user;
\q

# 7. Setup .env
nano .env
# Isi dengan DATABASE_URL, dll

# 8. Push schema & seed
npx prisma db push
npx prisma db seed

# 9. Build
npm run build

# 10. Install PM2
npm install -g pm2

# 11. Start app
pm2 start npm --name "asms" -- start
pm2 save
pm2 startup

# 12. Install Nginx
sudo apt install -y nginx

# 13. Configure Nginx
sudo nano /etc/nginx/sites-available/asms
# (paste config)

# 14. Enable site
sudo ln -s /etc/nginx/sites-available/asms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 15. Install SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📊 Perbandingan Lengkap

| Platform | Biaya | Setup | Kecepatan | Database | SSL | Custom Domain | Rekomendasi |
|----------|-------|-------|-----------|----------|-----|---------------|-------------|
| **Vercel + Supabase** | **Rp 0** | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | PostgreSQL 500MB | ✅ Auto | ✅ Gratis | ⭐⭐⭐⭐⭐ **TERBAIK!** |
| **Railway** | Rp 75k | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | PostgreSQL included | ✅ Auto | ✅ Gratis | ⭐⭐⭐⭐⭐ **Termudah!** |
| **Netlify + PlanetScale** | Rp 0 | ⭐⭐⭐⭐ | ⚡⚡ | MySQL 5GB | ✅ Auto | ✅ Gratis | ⭐⭐⭐⭐ |
| **Render** | Rp 0 | ⭐⭐⭐ | ⚡ | PostgreSQL 1GB | ✅ Auto | ✅ Gratis | ⭐⭐⭐ |
| **Contabo VPS** | Rp 60k | ⭐⭐ | ⚡⚡⚡ | Self-managed | Manual | ✅ | ⭐⭐⭐ |

---

## 🎯 Rekomendasi Berdasarkan Kebutuhan

### 1. Untuk Testing Gratis (Rekomendasi #1):
✅ **Vercel + Supabase**
- **Biaya**: Rp 0 (GRATIS!)
- **Setup**: 15 menit
- **Kecepatan**: Sangat cepat
- **Cocok untuk**: Testing, demo, production kecil

### 2. Untuk Setup Tercepat:
✅ **Railway**
- **Biaya**: $5/bulan (~Rp 75.000)
- **Setup**: 5 menit (paling mudah!)
- **Trial**: $5 gratis
- **Cocok untuk**: Testing cepat, tidak mau ribet

### 3. Untuk Budget Minimal Berbayar:
✅ **Contabo VPS**
- **Biaya**: €4/bulan (~Rp 60.000)
- **Spesifikasi**: Paling bagus untuk harga
- **Cocok untuk**: Production, full control

### 4. Untuk Belajar & Eksperimen:
✅ **DigitalOcean**
- **Biaya**: $6/bulan (~Rp 90.000)
- **Dokumentasi**: Sangat lengkap
- **Cocok untuk**: Belajar DevOps

---

## 🚀 Quick Start (Pilih Salah Satu)

### Opsi A: Vercel (GRATIS, 15 menit)
```bash
# 1. Push ke GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/USER/asms-alamin.git
git push -u origin main

# 2. Deploy di Vercel.com (import dari GitHub)
# 3. Setup Supabase database
# 4. Add environment variables
# 5. Deploy!
```

### Opsi B: Railway ($5, 5 menit)
```bash
# 1. Push ke GitHub
# 2. Deploy di Railway.app
# 3. Add PostgreSQL
# 4. Done!
```

### Opsi C: VPS (Rp 60k, 30 menit)
```bash
# 1. Beli VPS (Contabo/Hetzner)
# 2. SSH dan install
# 3. Deploy manual
```

---

## 💡 Tips Testing

### 1. Gunakan Subdomain Gratis
- **Vercel**: `your-project.vercel.app`
- **Railway**: `your-app.railway.app`
- **Netlify**: `your-site.netlify.app`

### 2. Custom Domain Gratis
- **Freenom**: Domain gratis (.tk, .ml, .ga)
- **Cloudflare**: DNS gratis + CDN

### 3. Monitoring Gratis
- **Vercel Analytics**: Built-in
- **UptimeRobot**: Monitor uptime gratis

### 4. Backup Database
- **Supabase**: Auto backup daily
- **Railway**: Manual backup via CLI

---

## 📞 Butuh Bantuan?

### Video Tutorial (Coming Soon)
- Deploy ke Vercel
- Setup Supabase
- Custom domain

### Support
- Email: support@mialamin.sch.id
- WhatsApp: 0812-3456-7890

---

## ✅ Kesimpulan

**Untuk Testing Awal, Pilih:**

1. **GRATIS & MUDAH**: Vercel + Supabase ⭐⭐⭐⭐⭐
2. **PALING MUDAH**: Railway ($5/bulan) ⭐⭐⭐⭐⭐
3. **BUDGET MINIMAL**: Contabo VPS (Rp 60k/bulan) ⭐⭐⭐⭐

**Rekomendasi Terbaik: Vercel + Supabase (100% GRATIS!)** 🎉

Setup 15 menit, gratis selamanya, perfect untuk testing dan production!
