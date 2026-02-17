# Update Vercel Environment Variables

## Masalah
Production (Vercel) menggunakan database Supabase lama yang belum memiliki kolom `photo` di tabel Teacher.
Local development menggunakan database Neon yang sudah di-migrate.

## Solusi: Update Vercel ke Database Neon

### Langkah 1: Buka Vercel Dashboard
1. Buka https://vercel.com/mialamingarut/systemalamin
2. Klik tab **Settings**
3. Klik **Environment Variables** di sidebar

### Langkah 2: Update DATABASE_URL
Cari variable `DATABASE_URL` dan update nilainya menjadi:
```
postgresql://neondb_owner:npg_a6sMHnbSfP7u@ep-withered-queen-aifmltu5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Langkah 3: Hapus DIRECT_URL (jika ada)
Jika ada variable `DIRECT_URL`, hapus saja karena tidak diperlukan untuk Neon.

### Langkah 4: Redeploy
Setelah environment variables diupdate:
1. Kembali ke tab **Deployments**
2. Klik titik tiga (...) pada deployment terakhir
3. Klik **Redeploy**
4. Tunggu hingga deployment selesai (2-3 menit)

### Langkah 5: Test
Buka https://madrasahalamin.vercel.app/dashboard/teachers
Seharusnya sudah bisa menampilkan data guru.

## Alternatif: Migrate Database Supabase
Jika ingin tetap menggunakan Supabase, jalankan migration di Supabase:

1. Update local .env dengan DATABASE_URL Supabase
2. Jalankan: `npx prisma migrate deploy`
3. Jalankan: `npx prisma db seed`

## Catatan
- Database Neon sudah memiliki semua data dan sudah di-migrate
- Lebih mudah menggunakan satu database untuk development dan production
- Pastikan Vercel environment variables sama dengan local .env
