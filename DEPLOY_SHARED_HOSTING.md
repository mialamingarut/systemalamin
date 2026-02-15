# 🚀 Deploy ke Shared Hosting (RumahWeb/AnymHost)

Panduan lengkap deploy AL-AMIN School Management System ke shared hosting murah.

## 📋 Pilihan Hosting & Harga

### Option 1: RumahWeb (Recommended)
**Paket: Cloud Hosting Bisnis**
- **Harga**: Rp 150.000/bulan (~Rp 1.5jt/tahun)
- **Spesifikasi**:
  - 2 CPU Cores
  - 2 GB RAM
  - 40 GB SSD Storage
  - Node.js Support ✅
  - SSH Access ✅
  - Free SSL ✅
- **Link**: https://www.rumahweb.com/cloud-hosting/

### Option 2: AnymHost
**Paket: Cloud Hosting**
- **Harga**: Rp 100.000/bulan (~Rp 1jt/tahun)
- **Spesifikasi**:
  - 1 CPU Core
  - 1 GB RAM
  - 20 GB SSD Storage
  - Node.js Support ✅
  - SSH Access ✅
- **Link**: https://anymhost.id/

### Option 3: Vercel (GRATIS!) ⭐ RECOMMENDED
**Paket: Hobby (Free)**
- **Harga**: Rp 0/bulan (GRATIS!)
- **Spesifikasi**:
  - Unlimited bandwidth
  - 100 GB bandwidth/month
  - Automatic HTTPS
  - Global CDN
  - Perfect untuk Next.js ✅
- **Link**: https://vercel.com

## 🎯 Rekomendasi: Vercel (Gratis) + Supabase (Gratis)

Kombinasi terbaik untuk budget minimal:

### Total Biaya: Rp 0/bulan! 🎉

**Frontend (Vercel):**
- ✅ Gratis selamanya
- ✅ Auto-deploy dari GitHub
- ✅ SSL otomatis
- ✅ CDN global
- ✅ Perfect untuk Next.js

**Database (Supabase):**
- ✅ Gratis 500MB database
- ✅ PostgreSQL managed
- ✅ Auto backup
- ✅ Dashboard GUI

---

## 🚀 CARA 1: Deploy ke Vercel (GRATIS & MUDAH)

### Step 1: Persiapan

1. **Buat akun GitHub** (jika belum punya)
   - https://github.com/signup

2. **Buat akun Vercel**
   - https://vercel.com/signup
   - Login dengan GitHub

3. **Buat akun Supabase**
   - https://supabase.com/dashboard
   - Login dengan GitHub

### Step 2: Setup Database di Supabase

1. **Buat Project Baru**
   - Klik "New Project"
   - Name: `asms-alamin`
   - Database Password: (simpan password ini!)
   - Region: Southeast Asia (Singapore)
   - Klik "Create new project"

2. **Get Connection String**
   - Buka Settings → Database
   - Copy "Connection string" (URI mode)
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

3. **Update Schema untuk PostgreSQL**
   
   Di local, jalankan:
   ```bash
   # Update schema.prisma
   # Ganti datasource dari sqlite ke postgresql
   ```

### Step 3: Push Code ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ASMS Al-Amin"

# Create repository di GitHub
# Buka https://github.com/new
# Nama: asms-alamin
# Jangan centang "Initialize with README"

# Add remote
git remote add origin https://github.com/USERNAME/asms-alamin.git

# Push
git branch -M main
git push -u origin main
```

### Step 4: Deploy ke Vercel

1. **Import Project**
   - Buka https://vercel.com/new
   - Klik "Import Git Repository"
   - Pilih repository `asms-alamin`
   - Klik "Import"

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**
   
   Klik "Environment Variables", tambahkan:
   
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=generate-random-string-here
   NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
   NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
   ```
   
   Generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu ~2 menit
   - Done! ✅

### Step 5: Setup Database

Setelah deploy berhasil:

1. **Install Vercel CLI** (di local)
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Pull Environment Variables**
   ```bash
   vercel env pull .env.production
   ```

5. **Push Database Schema**
   ```bash
   # Update .env dengan DATABASE_URL dari Supabase
   npx prisma db push
   ```

6. **Seed Database**
   ```bash
   npx prisma db seed
   ```

### Step 6: Akses Website

Website Anda sudah online di:
```
https://your-project.vercel.app
```

Login:
```
Email: admin@mialamin.sch.id
Password: admin123
```

---

## 🏢 CARA 2: Deploy ke Shared Hosting (RumahWeb/AnymHost)

### Prerequisites

- ✅ Paket hosting dengan Node.js support
- ✅ SSH access
- ✅ Domain (opsional, bisa pakai subdomain hosting)

### Step 1: Persiapan Local

1. **Build Production**
   ```bash
   npm run build
   ```

2. **Test Production Build**
   ```bash
   npm start
   ```
   
   Pastikan berjalan di http://localhost:3000

3. **Compress Files**
   ```bash
   # Compress semua file kecuali node_modules
   # Windows: Gunakan 7-Zip atau WinRAR
   # Compress: src, public, prisma, .next, package.json, dll
   # JANGAN include: node_modules, .git, .env
   ```

### Step 2: Upload ke Hosting

1. **Login cPanel**
   - Buka cPanel hosting Anda
   - Atau login via SSH

2. **Upload Files**
   
   **Via cPanel File Manager:**
   - Buka File Manager
   - Navigate ke `public_html` atau `domains/yourdomain.com`
   - Upload file .zip
   - Extract

   **Via SSH/FTP:**
   ```bash
   # Via SCP
   scp asms-alamin.zip user@yourhost.com:/home/user/public_html/
   
   # Via SSH
   ssh user@yourhost.com
   cd public_html
   unzip asms-alamin.zip
   ```

### Step 3: Install Dependencies

```bash
# SSH ke server
ssh user@yourhost.com

# Navigate ke folder
cd public_html/asms-alamin

# Install dependencies
npm install --production

# Install Prisma
npm install prisma @prisma/client
```

### Step 4: Setup Database

**Option A: MySQL (Jika hosting provide)**
```bash
# Update prisma/schema.prisma
# Ganti provider ke mysql

# Create database via cPanel
# Nama: asms_alamin

# Update .env
DATABASE_URL="mysql://user:password@localhost:3306/asms_alamin"

# Push schema
npx prisma db push

# Seed
npx prisma db seed
```

**Option B: PostgreSQL (Jika tersedia)**
```bash
# Sama seperti di atas, ganti ke postgresql
```

**Option C: SQLite (Paling mudah)**
```bash
# Sudah setup, tinggal:
npx prisma db push
npx prisma db seed
```

### Step 5: Setup Environment Variables

```bash
# Create .env file
nano .env
```

Isi:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_APP_NAME="AL-AMIN School Management System"
NEXT_PUBLIC_SCHOOL_NAME="Madrasah Ibtidaiyah Al-Amin"
NODE_ENV="production"
```

### Step 6: Setup Node.js App

**Via cPanel (Setup Node.js Application):**

1. Buka "Setup Node.js App"
2. Klik "Create Application"
3. Settings:
   - Node.js version: 18.x atau 20.x
   - Application mode: Production
   - Application root: `public_html/asms-alamin`
   - Application URL: yourdomain.com
   - Application startup file: `server.js`

4. Create `server.js`:
   ```javascript
   const { createServer } = require('http');
   const { parse } = require('url');
   const next = require('next');

   const dev = process.env.NODE_ENV !== 'production';
   const hostname = 'localhost';
   const port = process.env.PORT || 3000;

   const app = next({ dev, hostname, port });
   const handle = app.getRequestHandler();

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true);
         await handle(req, res, parsedUrl);
       } catch (err) {
         console.error('Error occurred handling', req.url, err);
         res.statusCode = 500;
         res.end('internal server error');
       }
     }).listen(port, (err) => {
       if (err) throw err;
       console.log(`> Ready on http://${hostname}:${port}`);
     });
   });
   ```

5. Klik "Save" dan "Start Application"

**Via SSH (Manual):**

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "asms-alamin" -- start

# Save PM2 config
pm2 save

# Setup auto-start
pm2 startup
```

### Step 7: Setup Reverse Proxy (Nginx/Apache)

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### Step 8: Setup SSL (HTTPS)

**Via cPanel:**
1. Buka "SSL/TLS Status"
2. Klik "Run AutoSSL"
3. Tunggu proses selesai

**Via Let's Encrypt (SSH):**
```bash
# Install Certbot
sudo apt install certbot

# Generate certificate
sudo certbot --nginx -d yourdomain.com
```

### Step 9: Test Website

Buka browser:
```
https://yourdomain.com
```

Login:
```
Email: admin@mialamin.sch.id
Password: admin123
```

---

## 💰 Perbandingan Biaya

| Platform | Biaya/Bulan | Biaya/Tahun | Database | SSL | Kelebihan |
|----------|-------------|-------------|----------|-----|-----------|
| **Vercel + Supabase** | **Rp 0** | **Rp 0** | PostgreSQL 500MB | ✅ Free | Gratis, mudah, auto-deploy |
| RumahWeb Cloud | Rp 150.000 | Rp 1.500.000 | MySQL/PostgreSQL | ✅ Free | Support lokal, cPanel |
| AnymHost Cloud | Rp 100.000 | Rp 1.000.000 | MySQL | ✅ Free | Murah, support lokal |
| VPS DigitalOcean | $6 (~Rp 90.000) | ~Rp 1.080.000 | Self-managed | Manual | Full control |

## ⭐ Rekomendasi

### Untuk Budget Minimal (Rp 0):
✅ **Vercel + Supabase**
- Gratis selamanya
- Perfect untuk Next.js
- Auto-deploy
- Global CDN
- SSL otomatis

### Untuk Support Lokal:
✅ **RumahWeb Cloud Hosting**
- Support Bahasa Indonesia
- cPanel mudah
- Node.js support
- Rp 150rb/bulan

### Untuk Budget Terbatas:
✅ **AnymHost**
- Paling murah
- Rp 100rb/bulan
- Support lokal

## 📝 Checklist Deployment

- [ ] Pilih platform hosting
- [ ] Buat akun hosting
- [ ] Setup database
- [ ] Upload code
- [ ] Install dependencies
- [ ] Setup environment variables
- [ ] Push database schema
- [ ] Seed database
- [ ] Start application
- [ ] Setup domain/SSL
- [ ] Test website
- [ ] Test login
- [ ] Test all features

## 🆘 Troubleshooting

### Error: Module not found
```bash
npm install
npm run build
```

### Error: Database connection failed
- Cek DATABASE_URL di .env
- Pastikan database sudah dibuat
- Test connection

### Error: Port already in use
```bash
# Kill process
pm2 stop all
pm2 delete all
pm2 start npm --name "asms" -- start
```

### Website tidak bisa diakses
- Cek apakah app running: `pm2 status`
- Cek logs: `pm2 logs`
- Cek reverse proxy config
- Cek firewall

## 📞 Support

Butuh bantuan deployment?
- Email: support@mialamin.sch.id
- WhatsApp: 0812-3456-7890

---

**Rekomendasi Terbaik: Deploy ke Vercel (GRATIS!) 🎉**

Paling mudah, paling cepat, dan GRATIS selamanya!
