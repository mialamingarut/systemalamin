# Setup Vercel Blob Storage untuk Upload Foto

## Masalah
Di Vercel, file yang diupload ke filesystem lokal (`public/uploads/`) akan hilang setiap kali deploy baru karena Vercel menggunakan serverless functions yang tidak memiliki persistent filesystem.

## Solusi: Vercel Blob Storage
Vercel Blob Storage adalah cloud storage yang terintegrasi dengan Vercel, gratis untuk penggunaan wajar.

## Langkah Setup

### 1. Buat Blob Store di Vercel

1. Buka https://vercel.com/dashboard/stores
2. Klik **Create Database** atau **Create Store**
3. Pilih **Blob**
4. Beri nama: `mialamin-uploads` (atau nama lain)
5. Pilih region: **Washington, D.C., USA (iad1)** (atau terdekat)
6. Klik **Create**

### 2. Copy Token

Setelah Blob Store dibuat:
1. Klik pada store yang baru dibuat
2. Klik tab **Settings** atau **Tokens**
3. Copy **Read-Write Token** (dimulai dengan `vercel_blob_rw_...`)

### 3. Tambahkan Environment Variable di Vercel

1. Buka https://vercel.com/mialamingarut/systemalamin/settings/environment-variables
2. Klik **Add New**
3. Name: `BLOB_READ_WRITE_TOKEN`
4. Value: Paste token yang sudah dicopy
5. Environment: Pilih **Production**, **Preview**, dan **Development**
6. Klik **Save**

### 4. Redeploy

1. Kembali ke tab **Deployments**
2. Klik titik tiga (...) pada deployment terakhir
3. Klik **Redeploy**
4. Tunggu hingga deployment selesai (2-3 menit)

## Cara Kerja

### Development (Localhost)
- File disimpan di `public/uploads/teachers/`
- URL: `/uploads/teachers/filename.jpg`
- File tersimpan di local filesystem

### Production (Vercel)
- File diupload ke Vercel Blob Storage
- URL: `https://xxxxx.public.blob.vercel-storage.com/teachers/filename.jpg`
- File tersimpan di cloud storage (persistent)

## Testing

1. Login ke https://madrasahalamin.vercel.app/login
2. Credentials: `admin@mialamin.sch.id` / `admin123`
3. Buka **Data Guru**
4. Klik **Edit** pada guru
5. Upload foto baru
6. Klik **Update Teacher**
7. Foto seharusnya muncul dan tidak hilang setelah deploy

## Pricing

Vercel Blob Storage gratis untuk:
- 1 GB storage
- 100 GB bandwidth per bulan

Untuk sekolah dengan ~500 siswa dan ~25 guru, ini lebih dari cukup.

## Alternatif (Jika Tidak Ingin Pakai Vercel Blob)

### 1. Cloudinary (Recommended)
- Free tier: 25 GB storage, 25 GB bandwidth
- Automatic image optimization
- Setup: https://cloudinary.com

### 2. AWS S3
- Pay as you go
- Lebih kompleks setup
- Lebih murah untuk scale besar

### 3. Supabase Storage
- Free tier: 1 GB storage
- Terintegrasi dengan Supabase database
- Setup: https://supabase.com

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not defined"
- Pastikan environment variable sudah ditambahkan di Vercel
- Pastikan sudah redeploy setelah menambahkan variable

### Foto tidak muncul setelah upload
- Cek console browser untuk error
- Pastikan token memiliki permission Read-Write
- Cek Vercel logs untuk error detail

### Foto lama (sebelum setup Blob) tidak muncul
- Foto lama yang tersimpan di `/uploads/` akan hilang
- Perlu upload ulang foto-foto tersebut
- Atau migrate foto lama ke Blob Storage

## Migration Script (Optional)

Jika ingin migrate foto lama dari local ke Blob:

```bash
# Coming soon - script untuk migrate existing photos
npm run migrate:photos
```
