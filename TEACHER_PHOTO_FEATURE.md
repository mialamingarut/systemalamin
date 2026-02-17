# Teacher Photo Upload Feature

## Overview
Fitur upload foto guru telah ditambahkan ke sistem, memungkinkan foto guru ditampilkan di landing page dan dashboard.

## Changes Made

### 1. Database Schema
**File**: `prisma/schema.prisma`
- Added `photo` field to Teacher model (nullable string)
- Migration SQL created: `prisma/migrations/add_teacher_photo.sql`

```prisma
model Teacher {
  // ... existing fields
  photo         String?   // New field
  // ... rest of fields
}
```

### 2. Upload Utility
**File**: `src/lib/upload.ts`
- Created `saveUploadedFile()` function for handling file uploads
- Saves files to `/public/uploads/teachers/` directory
- Validates file type (images only) and size (max 2MB)
- Generates unique filenames with timestamp
- Returns public URL path

### 3. Teacher Form Updates
**File**: `src/app/dashboard/teachers/components/TeacherForm.tsx`
- Added photo upload field with preview
- Image preview with remove button
- File validation (type and size)
- Drag & drop area with upload icon
- Recommended specs: Square image, min 400x400px

**Features**:
- ✅ Photo preview before upload
- ✅ Remove photo button
- ✅ File type validation (images only)
- ✅ File size validation (max 2MB)
- ✅ Visual feedback with icons

### 4. Teacher Actions Updates
**File**: `src/app/dashboard/teachers/actions.ts`
- Updated `createTeacher()` to handle photo upload
- Updated `updateTeacher()` to handle photo upload
- Updated `TeacherWithRelations` interface to include photo field
- Photo saved to server and URL stored in database

### 5. Landing Page Updates
**File**: `src/app/actions/teachers.ts`
- Updated `getTeachersForLanding()` to include photo field

**File**: `src/components/sections/TeachersSection.tsx`
- Updated to display teacher photos
- Falls back to User icon if no photo
- Added Image component from Next.js for optimization
- Hover effects on photo

### 6. Hero Section Animations
**File**: `src/components/sections/HeroSection.tsx`
- Added CountUp component for statistics
- Smooth count-up animation for numbers (500+, 25+, 15)
- Animations trigger when section is in viewport
- Duration: 2 seconds (configurable)

## How to Use

### For Administrators

1. **Add New Teacher**:
   - Go to Dashboard > Data Guru
   - Click "Tambah Guru"
   - Fill in all required fields
   - Click "Upload Photo" area
   - Select image file (max 2MB)
   - Preview will appear
   - Click "Create Teacher"

2. **Edit Existing Teacher**:
   - Go to Dashboard > Data Guru
   - Click edit icon on teacher card
   - Update photo by clicking upload area
   - Or remove existing photo with X button
   - Click "Update Teacher"

### Photo Requirements
- **Format**: JPG, PNG, GIF, WebP
- **Size**: Maximum 2MB
- **Recommended**: Square image, minimum 400x400px
- **Aspect Ratio**: 1:1 (square) for best results

## Landing Page Display

Teachers with photos will be displayed in the "Guru Kami" section:
- Modern ID card design
- Photo with gradient overlay
- Position badge
- Subjects tags
- Hover glow effect
- Responsive grid layout

## File Structure

```
/public
  /uploads
    /teachers          # Teacher photos stored here
      /[timestamp]-[filename].jpg

/src
  /lib
    upload.ts          # Upload utility functions
  /app
    /dashboard
      /teachers
        /components
          TeacherForm.tsx    # Form with photo upload
        actions.ts           # Server actions with photo handling
    /actions
      teachers.ts            # Landing page data fetching
  /components
    /sections
      TeachersSection.tsx    # Landing page teacher display
      HeroSection.tsx        # Hero with count-up animations
```

## Database Migration

**For Production (Vercel)**:
Run this SQL in your PostgreSQL database:

```sql
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "photo" TEXT;
```

**For Development**:
If you have local PostgreSQL:
```bash
npx prisma migrate dev --name add_teacher_photo
```

## Animations Added

### 1. Count-Up Animation
- **Component**: `src/components/ui/CountUp.tsx`
- **Usage**: Statistics in Hero section
- **Duration**: 2 seconds
- **Trigger**: When element enters viewport
- **Numbers**: 500+, 25+, 15

### 2. Scroll Animations
- **Component**: `src/components/ui/AnimatedSection.tsx`
- **Effect**: Fade-up with stagger
- **Duration**: 0.6-0.8s
- **Easing**: Smooth cubic-bezier
- **Trigger**: Intersection Observer (once)

### 3. Existing Animations
- ✅ Hero section: Fade-in, slide-in
- ✅ Floating shapes: Smooth floating
- ✅ Cards: Hover lift effect
- ✅ Buttons: Scale on hover
- ✅ Images: Zoom on hover
- ✅ Navbar: Scroll effect

## Performance Considerations

1. **Image Optimization**:
   - Use Next.js Image component
   - Automatic lazy loading
   - Responsive image sizes
   - WebP format support

2. **File Upload**:
   - Client-side validation before upload
   - Server-side validation
   - Unique filenames prevent conflicts
   - Organized folder structure

3. **Animations**:
   - GPU-accelerated transforms
   - Intersection Observer for performance
   - Animation runs once (once: true)
   - Minimal re-renders

## Security

1. **File Validation**:
   - Type checking (images only)
   - Size limit (2MB)
   - Filename sanitization
   - Unique filenames

2. **Server-Side**:
   - FormData validation
   - Error handling
   - Transaction safety
   - Activity logging

## Future Enhancements

### Phase 2
- [ ] Image cropping tool
- [ ] Multiple photo upload
- [ ] Photo gallery for teachers
- [ ] Automatic image optimization
- [ ] CDN integration

### Phase 3
- [ ] Drag & drop upload
- [ ] Bulk photo upload
- [ ] Photo management dashboard
- [ ] Image filters/effects
- [ ] Avatar generation

## Testing Checklist

- [x] Photo upload works in create form
- [x] Photo upload works in edit form
- [x] Photo preview displays correctly
- [x] Remove photo button works
- [x] File validation works (type & size)
- [x] Photos display on landing page
- [x] Fallback icon shows when no photo
- [x] Count-up animations work
- [x] Scroll animations smooth
- [ ] Test on production database
- [ ] Test with various image formats
- [ ] Test with large files
- [ ] Test responsive display

## Notes

- Migration SQL provided for production
- Upload folder created automatically
- Photos stored in `/public/uploads/teachers/`
- Public URL format: `/uploads/teachers/[filename]`
- Old teachers without photos show User icon
- All animations optimized for performance
- Mobile-responsive design maintained

## Deployment

1. Push code to GitHub (done)
2. Vercel auto-deploys
3. Run migration SQL in production database:
   ```sql
   ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "photo" TEXT;
   ```
4. Test photo upload in production
5. Verify landing page displays photos

## Support

For issues or questions:
- Check console for error messages
- Verify file size and type
- Ensure database migration ran
- Check file permissions on server
