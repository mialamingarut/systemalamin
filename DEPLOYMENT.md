# 🚀 Panduan Deployment ASMS

## Deployment ke Vercel + Supabase (GRATIS)

### 1. Setup Database di Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Klik "New Project"
3. Isi detail project:
   - Name: `asms-alamin`
   - Database Password: (simpan password ini)
   - Region: Southeast Asia (Singapore)
4. Tunggu project selesai dibuat (~2 menit)
5. Buka Settings → Database
6. Copy "Connection String" (URI mode)
7. Ganti `[YOUR-PASSWORD]` dengan password database Anda

### 2. Deploy ke Vercel

1. Push code ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/asms-alamin.git
git push -u origin main
```

2. Buka [Vercel](https://vercel.com)
3. Klik "Import Project"
4. Pilih repository GitHub Anda
5. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. Environment Variables (klik "Add"):
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-random-string-here
NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
```

7. Klik "Deploy"

### 3. Setup Database Schema

Setelah deployment berhasil:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Link project:
```bash
vercel link
```

4. Push database schema:
```bash
vercel env pull .env.local
npx prisma db push
```

5. Seed database:
```bash
npx prisma db seed
```

### 4. Custom Domain (Opsional)

1. Beli domain di [Niagahoster](https://niagahoster.co.id) atau [Cloudflare](https://cloudflare.com)
2. Di Vercel, buka Settings → Domains
3. Tambahkan domain Anda
4. Update DNS records sesuai instruksi Vercel

---

## Deployment ke VPS (Manual)

### Prerequisites
- VPS dengan Ubuntu 22.04
- Domain (opsional)
- SSH access

### 1. Setup VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Setup Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE asms_alamin;
CREATE USER asms_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE asms_alamin TO asms_user;
\q
```

### 3. Deploy Aplikasi

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/username/asms-alamin.git
cd asms-alamin

# Install dependencies
sudo npm install

# Setup environment
sudo nano .env
```

Isi `.env`:
```env
DATABASE_URL="postgresql://asms_user:your_secure_password@localhost:5432/asms_alamin"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-random-string"
NEXT_PUBLIC_APP_NAME="AL-AMIN School Management System"
NEXT_PUBLIC_SCHOOL_NAME="Madrasah Ibtidaiyah Al-Amin"
```

```bash
# Push database schema
npx prisma db push

# Seed database
npx prisma db seed

# Build aplikasi
sudo npm run build

# Start dengan PM2
pm2 start npm --name "asms" -- start
pm2 save
pm2 startup
```

### 4. Setup Nginx

```bash
sudo nano /etc/nginx/sites-available/asms
```

Isi konfigurasi:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/asms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Deployment ke Railway (Mudah & Murah)

### 1. Setup Railway

1. Buka [Railway](https://railway.app)
2. Login dengan GitHub
3. Klik "New Project"
4. Pilih "Deploy from GitHub repo"
5. Pilih repository Anda

### 2. Add PostgreSQL

1. Klik "New" → "Database" → "PostgreSQL"
2. Copy `DATABASE_URL` dari Variables tab

### 3. Configure Environment

Di tab Variables, tambahkan:
```env
DATABASE_URL=(auto-generated)
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=generate-random-string
NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
```

### 4. Deploy

Railway akan otomatis build dan deploy aplikasi Anda.

---

## Maintenance

### Backup Database

**Supabase:**
- Otomatis backup daily
- Download manual: Dashboard → Database → Backups

**VPS:**
```bash
# Backup
pg_dump -U asms_user asms_alamin > backup_$(date +%Y%m%d).sql

# Restore
psql -U asms_user asms_alamin < backup_20260215.sql
```

### Update Aplikasi

**Vercel:**
```bash
git add .
git commit -m "Update"
git push
# Vercel auto-deploy
```

**VPS:**
```bash
cd /var/www/asms-alamin
sudo git pull
sudo npm install
sudo npm run build
pm2 restart asms
```

### Monitoring

**PM2 (VPS):**
```bash
pm2 status
pm2 logs asms
pm2 monit
```

**Vercel:**
- Dashboard → Analytics
- Dashboard → Logs

---

## Estimasi Biaya

### Gratis (Recommended untuk Start)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Total**: Rp 0/bulan

### VPS (Untuk Scale)
- **Niagahoster VPS**: Rp 100.000/bulan
- **Domain .sch.id**: Rp 50.000/tahun
- **Total**: ~Rp 105.000/bulan

### Railway (Mudah)
- **Starter**: $5/month (~Rp 75.000)
- **PostgreSQL**: Included
- **Total**: ~Rp 75.000/bulan

---

## Troubleshooting

### Error: Database connection failed
- Cek `DATABASE_URL` di environment variables
- Pastikan database sudah running
- Cek firewall/security group

### Error: Build failed
- Cek Node.js version (harus 18+)
- Hapus `node_modules` dan `npm install` ulang
- Cek error log detail

### Error: 500 Internal Server Error
- Cek logs: `pm2 logs asms` atau Vercel logs
- Cek environment variables
- Cek database connection

### Performance Issues
- Enable caching di Nginx
- Optimize images (Next.js Image)
- Enable CDN (Vercel otomatis)
- Scale database (upgrade plan)

---

## Support

Butuh bantuan deployment?
- Email: info@mialamin.sch.id
- WhatsApp: 0812-3456-7890
