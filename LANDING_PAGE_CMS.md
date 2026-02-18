# Landing Page CMS - Content Management System

## Overview
Fitur untuk mengelola semua konten landing page MI Al-Amin dari dashboard admin, termasuk:
- Hero Section (headline, CTA)
- Trust Indicators (statistik)
- About/Features
- Program Unggulan
- Gallery
- Testimonials

## Database Models

### 1. LandingHero
Mengelola hero section (bagian paling atas landing page)
- headline: Judul utama
- subheadline: Subjudul
- ctaPrimary: Teks tombol utama
- ctaSecondary: Teks tombol sekunder (optional)
- isActive: Status aktif/nonaktif

### 2. LandingStats
Mengelola statistik (500+ siswa, 25+ guru, dll)
- students: Jumlah siswa
- teachers: Jumlah guru
- years: Tahun berdiri
- isActive: Status aktif/nonaktif

### 3. LandingFeature
Mengelola keunggulan sekolah (About Section)
- title: Judul keunggulan
- description: Deskripsi
- icon: Nama icon dari lucide-react
- order: Urutan tampil
- isActive: Status aktif/nonaktif

### 4. LandingProgram
Mengelola program unggulan
- title: Nama program
- description: Deskripsi program
- image: Foto program
- features: Array fitur program
- order: Urutan tampil
- isActive: Status aktif/nonaktif

### 5. LandingGallery
Mengelola galeri foto
- title: Judul foto
- description: Deskripsi (optional)
- image: URL foto
- category: Kategori (Kegiatan, Fasilitas, Prestasi)
- order: Urutan tampil
- isActive: Status aktif/nonaktif

### 6. LandingTestimonial
Mengelola testimoni
- name: Nama pemberi testimoni
- role: Peran (Orang Tua Siswa, Alumni, dll)
- content: Isi testimoni
- avatar: Foto (optional)
- rating: Rating 1-5
- order: Urutan tampil
- isActive: Status aktif/nonaktif

## Dashboard Menu Structure

```
Dashboard
├── Data Siswa
├── Data Guru
├── Kelas
├── SPMB
├── Keuangan
├── Akademik
├── Landing Page ← NEW
│   ├── Hero Section
│   ├── Statistik
│   ├── Keunggulan
│   ├── Program
│   ├── Galeri
│   └── Testimoni
└── Pengaturan
```

## Implementation Plan

### Phase 1: Database & Schema
- [x] Add models to Prisma schema
- [ ] Create migration
- [ ] Seed initial data

### Phase 2: Server Actions
- [ ] Create CRUD actions for each model
- [ ] Add revalidation for landing page

### Phase 3: Dashboard UI
- [ ] Create landing page menu in sidebar
- [ ] Create management pages for each section
- [ ] Create forms with image upload support

### Phase 4: Landing Page Integration
- [ ] Update landing page sections to fetch from database
- [ ] Add fallback for empty data
- [ ] Test all sections

## Features

### Hero Section Management
- Edit headline & subheadline
- Customize CTA button text
- Preview changes

### Statistics Management
- Update student count
- Update teacher count
- Update years of experience
- Auto count-up animation

### Features Management
- Add/Edit/Delete features
- Choose icon from library
- Reorder features (drag & drop)
- Toggle active/inactive

### Program Management
- Add/Edit/Delete programs
- Upload program images
- Add multiple features per program
- Reorder programs

### Gallery Management
- Upload multiple images
- Add title & description
- Categorize images
- Reorder images
- Masonry layout

### Testimonial Management
- Add/Edit/Delete testimonials
- Upload avatar
- Set rating (1-5 stars)
- Reorder testimonials
- Auto-rotate slider

## Technical Details

### Image Upload
- Uses Vercel Blob Storage
- Supports: JPG, PNG, WebP
- Max size: 2MB per image
- Auto-optimization

### Caching & Revalidation
- Landing page cached for performance
- Auto-revalidate on content update
- Manual revalidate button in dashboard

### Permissions
- Only SUPER_ADMIN and ADMIN can edit
- Teachers can view only
- Parents cannot access

## Migration Steps

1. Run migration: `npx prisma migrate dev --name add_landing_cms`
2. Seed initial data: `npx prisma db seed`
3. Deploy to production
4. Test all sections

## Future Enhancements

- [ ] Preview mode before publish
- [ ] Schedule content publish
- [ ] Version history
- [ ] A/B testing
- [ ] Analytics integration
- [ ] SEO meta tags management
