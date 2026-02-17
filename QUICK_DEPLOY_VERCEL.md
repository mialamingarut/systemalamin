# Quick Deploy ke Vercel - 5 Menit! ⚡

## Cara Tercepat (Recommended)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Deploy!
```bash
# Preview deployment (untuk testing)
vercel

# Production deployment
vercel --prod
```

## Atau Gunakan Script Otomatis

### Windows (PowerShell):
```powershell
.\deploy-to-vercel.ps1
```

### Linux/Mac:
```bash
chmod +x deploy-to-vercel.sh
./deploy-to-vercel.sh
```

## Setelah Deploy Pertama Kali

### Setup Database (WAJIB!)
```bash
# Set production database URL
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Seed data (admin user, dll)
npx prisma db seed
```

### Login Credentials
- **Email**: `admin@mialamin.sch.id`
- **Password**: `admin123`

## Environment Variables di Vercel

Jika deploy via dashboard, tambahkan di Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres:C8Mo7Vas9PmGSQH0@db.qjliveyhaqaywhyxnakj.supabase.co:5432/postgres
NEXTAUTH_URL=https://madrasahalamin.vercel.app
NEXTAUTH_SECRET=OBsTc53SKNX0Vz9jiegQ7AqmyIZfhFCx
NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
```

## Troubleshooting

### Build Failed?
```bash
# Force rebuild
vercel --force
```

### Database Error?
1. Cek environment variables di Vercel
2. Pastikan Supabase database aktif
3. Run migrations: `npx prisma migrate deploy`

### Can't Login?
1. Pastikan database sudah di-seed
2. Cek NEXTAUTH_SECRET di environment variables
3. Clear browser cookies

## URL Production

Setelah deploy: **https://madrasahalamin.vercel.app**

## Monitoring

- **Logs**: https://vercel.com/dashboard → Your Project → Logs
- **Analytics**: https://vercel.com/dashboard → Your Project → Analytics
- **Database**: https://supabase.com/dashboard

---

**Siap Deploy?** Jalankan `vercel --prod` sekarang! 🚀
