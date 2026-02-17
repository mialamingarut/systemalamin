# Setup Database Production - SEKARANG! ⚡

## Masalah Anda: "Email atau password salah"

Ini karena database production masih kosong. Belum ada tabel dan user.

## Solusi Cepat (2 Menit)

### Copy-Paste Command Ini:

```powershell
# 1. Set database URL
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# 2. Push schema ke database
npx prisma db push --schema=prisma/schema-postgresql.prisma --accept-data-loss

# 3. Seed data (buat user admin)
npx prisma db seed
```

### Atau Gunakan Script Otomatis:

```powershell
.\setup-db-production.ps1
```

## Setelah Selesai

Login di Vercel dengan:
- **Email**: `admin@mialamin.sch.id`
- **Password**: `admin123`

## Jika Ada Error

### Error: "Can't reach database server"

**Cek 1**: Supabase project masih aktif?
- Buka https://supabase.com/dashboard
- Pastikan project tidak paused

**Cek 2**: IP Whitelist
- Di Supabase Dashboard → Settings → Database
- Scroll ke "Connection Pooling"
- Pastikan "Restrict access to specific IP addresses" = OFF
- Atau tambahkan `0.0.0.0/0` untuk allow all

### Error: "Schema not synced"

```powershell
# Generate Prisma Client dulu
npx prisma generate --schema=prisma/schema-postgresql.prisma

# Lalu push lagi
npx prisma db push --schema=prisma/schema-postgresql.prisma
```

### Error: "Seed failed"

```powershell
# Cek package.json ada prisma.seed config
# Jika tidak ada, tambahkan:
```

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Verifikasi Setup Berhasil

### 1. Cek via Prisma Studio (Lokal)

```powershell
npx prisma studio --schema=prisma/schema-postgresql.prisma
```

Buka http://localhost:5555 dan cek:
- Tabel `User` ada data admin
- Tabel `AcademicYear` ada data 2026/2027

### 2. Cek via Supabase Dashboard

1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik "Table Editor"
4. Cek tabel `User` - harus ada 2 user (admin & guru)

### 3. Test Login di Vercel

1. Buka https://madrasahalamin.vercel.app/login
2. Login dengan `admin@mialamin.sch.id` / `admin123`
3. Harus berhasil masuk ke dashboard

## Data yang Akan Dibuat

Setelah seed, database akan berisi:

### Users:
1. **Super Admin**
   - Email: `admin@mialamin.sch.id`
   - Password: `admin123`
   - Role: SUPER_ADMIN

2. **Guru**
   - Email: `guru@mialamin.sch.id`
   - Password: `admin123`
   - Role: TEACHER

### Academic Year:
- Tahun Ajaran: 2026/2027
- Status: Active

### Sample Data:
- 1 Teacher (Ahmad Fauzi, S.Pd)
- 1 Parent (Budi Santoso)
- 2 Students (Ahmad & Siti)
- 1 Class (Kelas 1A)

## Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| Connection timeout | Cek Supabase project aktif |
| Schema mismatch | Run `npx prisma generate` |
| Seed failed | Cek `package.json` ada config seed |
| User already exists | Database sudah di-seed, langsung login |

## Status Checklist

Setelah setup, pastikan:
- [ ] Command `npx prisma db push` berhasil
- [ ] Command `npx prisma db seed` berhasil
- [ ] Bisa login di Vercel
- [ ] Dashboard bisa diakses
- [ ] Menu-menu berfungsi

---

**Butuh Bantuan?**

Jika masih error, screenshot error message dan tanyakan lagi!

**Ready?** Jalankan command di atas sekarang! 🚀
