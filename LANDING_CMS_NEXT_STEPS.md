# Landing Page CMS - Next Steps

## Current Status

### ✅ Completed
1. Database schema created (6 models)
2. Migration applied to database
3. Documentation created (LANDING_PAGE_CMS.md)
4. Initial commit made

### ⚠️ In Progress
- Seed file has duplicate code that needs to be cleaned

### ❌ Not Started
- Server actions for CRUD operations
- Dashboard UI pages
- Landing page integration
- Sidebar menu update

## Immediate Next Steps

### 1. Fix Seed File (PRIORITY)

The seed file has duplicate landing CMS code after the `main()` function. 

**Action Required:**
1. Open `prisma/seed.ts`
2. Find the duplicate code after line ~260 (after `.finally()`)
3. Delete everything after `.finally(async () => { await prisma.$disconnect(); });`
4. The landing CMS seed code should only exist INSIDE the `main()` function, before the final `console.log('🎉 Seeding completed!')`
5. Run: `npx prisma db seed`

### 2. Create Server Actions

Create `src/app/dashboard/landing/actions.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Hero Actions
export async function getHero() {
  return await prisma.landingHero.findFirst({ where: { isActive: true } })
}

export async function updateHero(id: string, data: any) {
  const result = await prisma.landingHero.update({ where: { id }, data })
  revalidatePath('/')
  return result
}

// Stats Actions
export async function getStats() {
  return await prisma.landingStats.findFirst({ where: { isActive: true } })
}

export async function updateStats(id: string, data: any) {
  const result = await prisma.landingStats.update({ where: { id }, data })
  revalidatePath('/')
  return result
}

// Gallery Actions
export async function getGalleryItems() {
  return await prisma.landingGallery.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { order: 'asc' }
  })
}

export async function createGalleryItem(data: any) {
  const result = await prisma.landingGallery.create({ data })
  revalidatePath('/')
  return result
}

export async function updateGalleryItem(id: string, data: any) {
  const result = await prisma.landingGallery.update({ where: { id }, data })
  revalidatePath('/')
  return result
}

export async function deleteGalleryItem(id: string) {
  const result = await prisma.landingGallery.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
  revalidatePath('/')
  return result
}

// Similar actions for Features, Programs, Testimonials...
```

### 3. Create Dashboard Pages

#### Gallery Page (Start Here - Simplest)

Create `src/app/dashboard/landing/gallery/page.tsx`:

```typescript
import { getGalleryItems } from '../actions'
import GalleryManager from './components/GalleryManager'

export default async function GalleryPage() {
  const items = await getGalleryItems()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Galeri Landing Page</h1>
          <p className="text-gray-600">Kelola foto-foto yang tampil di landing page</p>
        </div>
      </div>
      
      <GalleryManager initialItems={items} />
    </div>
  )
}
```

Create `src/app/dashboard/landing/gallery/components/GalleryManager.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Upload, Trash2, Edit } from 'lucide-react'
import Image from 'next/image'
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../actions'
import { useToast } from '@/components/ui/Toast'

export default function GalleryManager({ initialItems }) {
  const [items, setItems] = useState(initialItems)
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Upload file using your upload utility
      // Then create gallery item
      toast.success('Foto berhasil diupload')
    } catch (error) {
      toast.error('Gagal upload foto')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div>
        <input
          type="file"
          id="gallery-upload"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <label
          htmlFor="gallery-upload"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Foto</span>
        </label>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-48"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              <button className="p-2 bg-white rounded-full">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 bg-red-500 text-white rounded-full">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. Update Sidebar

Add Landing Page menu to `src/components/dashboard/Sidebar.tsx`:

```typescript
// Add after Akademik menu
{
  name: 'Landing Page',
  icon: Globe,
  href: '/dashboard/landing',
  subItems: [
    { name: 'Hero & Stats', href: '/dashboard/landing/hero' },
    { name: 'Keunggulan', href: '/dashboard/landing/features' },
    { name: 'Program', href: '/dashboard/landing/programs' },
    { name: 'Galeri', href: '/dashboard/landing/gallery' },
    { name: 'Testimoni', href: '/dashboard/landing/testimonials' },
  ],
},
```

### 5. Update Landing Page Sections

Update each section to fetch from database instead of hardcoded data.

Example for `src/components/sections/GallerySection.tsx`:

```typescript
import { prisma } from '@/lib/prisma'

async function getGalleryData() {
  return await prisma.landingGallery.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: { order: 'asc' },
    take: 12
  })
}

export default async function GallerySection() {
  const items = await getGalleryData()
  
  return (
    <section>
      {/* Render gallery items from database */}
    </section>
  )
}
```

## File Structure

```
src/app/dashboard/landing/
├── page.tsx (overview/dashboard)
├── actions.ts (all CRUD operations)
├── hero/
│   ├── page.tsx
│   └── components/
│       └── HeroForm.tsx
├── features/
│   ├── page.tsx
│   └── components/
│       ├── FeatureList.tsx
│       └── FeatureForm.tsx
├── programs/
│   ├── page.tsx
│   └── components/
│       ├── ProgramList.tsx
│       └── ProgramForm.tsx
├── gallery/
│   ├── page.tsx
│   └── components/
│       └── GalleryManager.tsx
└── testimonials/
    ├── page.tsx
    └── components/
        ├── TestimonialList.tsx
        └── TestimonialForm.tsx
```

## Testing Checklist

- [ ] Seed data successfully
- [ ] Access /dashboard/landing/gallery
- [ ] Upload new image
- [ ] Edit image title/description
- [ ] Delete image
- [ ] Check landing page shows updated gallery
- [ ] Test all other sections similarly

## Deployment

1. Commit all changes
2. Push to GitHub
3. Vercel will auto-deploy
4. Run migration in production (automatic via vercel.json)
5. Run seed in production if needed

## Estimated Time

- Fix seed: 5 minutes
- Create actions: 30 minutes
- Create gallery page: 1 hour
- Create other pages: 2-3 hours
- Update landing sections: 1 hour
- Testing: 30 minutes

**Total: ~5-6 hours for complete implementation**

## Priority Order

1. **Fix seed file** (must do first)
2. **Gallery** (simplest, good starting point)
3. **Hero & Stats** (most visible impact)
4. **Features & Programs** (medium complexity)
5. **Testimonials** (similar to gallery)

## Need Help?

Refer to existing modules for patterns:
- `src/app/dashboard/teachers/` - Good example of CRUD
- `src/app/dashboard/academic/` - Good example of multiple sub-pages
- `src/app/dashboard/settings/` - Good example of forms

## Current Commit

Latest commit: `wip: add landing page CMS schema and initial setup`

Continue from here in a new conversation or implement following this guide!
