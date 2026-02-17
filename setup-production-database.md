# Setup Production Database - Vercel

## Masalah: "Email atau password salah"

Ini terjadi karena database production (Supabase) masih kosong. Belum ada tabel dan data user.

## Solusi: Setup Database Production

### Langkah 1: Test Koneksi Database

```bash
# Set production database URL
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Test koneksi
npx prisma db pull
```

Jika berhasil, lanjut ke langkah 2.

### Langkah 2: Push Schema ke Production

```bash
# Push schema PostgreSQL ke production
npx prisma db push --schema=prisma/schema-postgresql.prisma
```

Atau jika ingin dengan migrations:

```bash
# Generate migration
npx prisma migrate dev --name init --schema=prisma/schema-postgresql.prisma

# Deploy ke production
npx prisma migrate deploy --schema=prisma/schema-postgresql.prisma
```

### Langkah 3: Seed Data (User Admin, dll)

```bash
# Seed data
npx prisma db seed
```

Ini akan membuat:
- User admin: `admin@mialamin.sch.id` / `admin123`
- User guru: `guru@mialamin.sch.id` / `admin123`
- Academic year aktif
- Sample data lainnya

### Langkah 4: Verifikasi

```bash
# Buka Prisma Studio untuk cek data
npx prisma studio
```

Atau cek langsung di Supabase Dashboard:
1. Buka https://supabase.com/dashboard
2. Pilih project Anda
3. Klik "Table Editor"
4. Cek tabel `User` - harus ada data admin

## Alternatif: Setup via Supabase SQL Editor

Jika cara di atas tidak berhasil, bisa manual via Supabase:

### 1. Buka Supabase SQL Editor
https://supabase.com/dashboard → Your Project → SQL Editor

### 2. Jalankan SQL untuk Create Tables

Copy schema dari `prisma/schema-postgresql.prisma` dan convert ke SQL, atau:

```sql
-- Buat enum types
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT', 'STUDENT');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE "SPMBStatus" AS ENUM ('REGISTERED', 'VERIFIED', 'TESTED', 'PASSED', 'FAILED', 'ENROLLED');

-- Buat tabel User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Insert admin user (password: admin123)
INSERT INTO "User" ("id", "email", "password", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES (
    'admin-001',
    'admin@mialamin.sch.id',
    '$2a$10$YourHashedPasswordHere',  -- Ganti dengan hash bcrypt
    'Super Admin',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);
```

### 3. Generate Password Hash

Untuk generate password hash `admin123`:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));"
```

Copy hasil hash dan ganti di SQL query di atas.

## Troubleshooting

### Error: "Can't reach database server"
**Solusi**: 
1. Cek Supabase project masih aktif
2. Cek DATABASE_URL benar
3. Cek IP whitelist di Supabase (set ke 0.0.0.0/0 untuk allow all)

### Error: "Schema not found"
**Solusi**:
```bash
# Generate Prisma Client dulu
npx prisma generate --schema=prisma/schema-postgresql.prisma
```

### Error: "Migration failed"
**Solusi**:
```bash
# Reset database (HATI-HATI: Hapus semua data!)
npx prisma migrate reset --schema=prisma/schema-postgresql.prisma

# Atau push langsung tanpa migration
npx prisma db push --schema=prisma/schema-postgresql.prisma
```

## Setelah Setup Berhasil

1. **Test Login di Vercel**:
   - URL: https://madrasahalamin.vercel.app/login
   - Email: `admin@mialamin.sch.id`
   - Password: `admin123`

2. **Cek Dashboard**:
   - Harus bisa masuk ke dashboard
   - Cek semua menu berfungsi

3. **Test CRUD**:
   - Tambah siswa baru
   - Edit data
   - Delete data
   - Export Excel/PDF

## Quick Command (All-in-One)

```bash
# Set database URL
$env:DATABASE_URL="postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Push schema + seed
npx prisma db push --schema=prisma/schema-postgresql.prisma && npx prisma db seed
```

## Status Check

Setelah setup, cek:
- [ ] Database tables created
- [ ] Admin user exists
- [ ] Can login at Vercel URL
- [ ] Dashboard accessible
- [ ] CRUD operations work

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
