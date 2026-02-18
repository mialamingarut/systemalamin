# Hero Image Upload Feature - Complete ✅

## Fitur yang Ditambahkan

### 1. Database Schema
- Menambahkan field `heroImage` (String, nullable) ke model `LandingHero`
- Field ini menyimpan URL gambar hero yang diupload

### 2. Dashboard Upload Form
**File**: `src/app/dashboard/landing/hero/components/HeroStatsForm.tsx`

Fitur upload gambar:
- Drag & drop atau klik untuk upload
- Preview gambar sebelum save
- Tombol hapus gambar (X)
- Validasi: PNG, JPG, WEBP (Max 5MB)
- Instruksi yang jelas untuk user

### 3. Server Actions
**File**: `src/app/dashboard/landing/actions.ts`

Function `updateHero` sudah diupdate untuk:
- Menerima FormData (bukan JSON)
- Handle file upload dengan `saveUploadedFile(file, 'hero')`
- Menyimpan URL gambar ke database
- Auto revalidate landing page

### 4. Landing Page Display
**File**: `src/components/sections/HeroSection.tsx`

Hero section sekarang:
- Menampilkan gambar dari database (`hero.heroImage`)
- Fallback ke placeholder jika gambar tidak ada
- Fallback jika gambar gagal load
- Pesan instruksi untuk upload di dashboard

## Cara Menggunakan

### Upload Gambar Hero
1. Login ke dashboard sebagai admin
2. Buka menu **Landing Page → Hero & Statistik**
3. Scroll ke bagian "Gambar Hero (Opsional)"
4. Klik area upload atau drag & drop gambar
5. Preview akan muncul
6. Klik "Simpan Perubahan"
7. Gambar akan otomatis muncul di landing page

### Menghapus Gambar
1. Klik tombol X (merah) di pojok kanan atas preview
2. Klik "Simpan Perubahan"
3. Landing page akan kembali ke placeholder

## Storage
- **Development**: File disimpan di `/public/uploads/hero/`
- **Production (Vercel)**: File disimpan di Vercel Blob Storage
- Auto-detect environment dengan `process.env.VERCEL`

## Ukuran & Format
- Format: PNG, JPG, WEBP
- Ukuran maksimal: 5MB
- Resolusi rekomendasi: 1200x800px atau lebih tinggi
- Aspect ratio: 3:2 (landscape)

## Status
✅ Schema updated (heroImage field added)
✅ Upload form created with preview
✅ Server actions updated
✅ Landing page updated to display image
✅ Build successful
✅ Pushed to GitHub
✅ Auto-deployed to Vercel

## Testing
Silakan test di dashboard:
1. Upload gambar hero
2. Cek preview di form
3. Save dan cek landing page
4. Test hapus gambar
5. Test dengan berbagai ukuran file

Semua fitur sudah siap digunakan! 🎉
