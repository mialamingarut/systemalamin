# Performance Optimization Guide
## AL-AMIN School Management System

**Purpose:** Optimize application performance for production deployment
**Date:** 2026-02-15

---

## 1. Database Optimization

### 1.1 Add Database Indexes ✅

**Recommended Indexes:**

```prisma
// prisma/schema.prisma

model Student {
  id             String   @id @default(cuid())
  nis            String   @unique
  name           String
  status         String   @default("ACTIVE")
  parentId       String
  deletedAt      DateTime?
  
  @@index([name])           // For search
  @@index([status])         // For filtering
  @@index([parentId])       // For relations
  @@index([deletedAt])      // For soft delete queries
  @@index([nis, deletedAt]) // Composite for unique checks
}

model Teacher {
  id        String   @id @default(cuid())
  nip       String   @unique
  name      String
  email     String   @unique
  userId    String   @unique
  deletedAt DateTime?
  
  @@index([name])      // For search
  @@index([email])     // For lookups
  @@index([userId])    // For relations
  @@index([deletedAt]) // For soft delete queries
}

model Class {
  id             String   @id @default(cuid())
  name           String
  grade          Int
  teacherId      String
  academicYearId String
  deletedAt      DateTime?
  
  @@index([grade])                    // For filtering
  @@index([teacherId])                // For relations
  @@index([academicYearId])           // For relations
  @@index([deletedAt])                // For soft delete queries
  @@index([name, academicYearId])     // For uniqueness checks
}

model Invoice {
  id         String   @id @default(cuid())
  studentId  String
  status     String   @default("PENDING")
  month      Int
  year       Int
  createdAt  DateTime @default(now())
  
  @@index([studentId])           // For relations
  @@index([status])              // For filtering
  @@index([month, year])         // For filtering by period
  @@index([createdAt])           // For sorting
  @@index([studentId, month, year]) // For duplicate checks
}

model SPMBApplicant {
  id        String   @id @default(cuid())
  name      String
  status    String   @default("REGISTERED")
  testScore Int?
  createdAt DateTime @default(now())
  
  @@index([status])     // For filtering
  @@index([testScore])  // For ranking
  @@index([createdAt])  // For sorting
}

model ActivityLog {
  id        String   @id @default(cuid())
  userId    String
  action    String
  entity    String
  createdAt DateTime @default(now())
  
  @@index([userId])     // For filtering
  @@index([action])     // For filtering
  @@index([entity])     // For filtering
  @@index([createdAt])  // For sorting and date range queries
}

model User {
  id    String @id @default(cuid())
  email String @unique
  role  Role
  
  @@index([email])  // For login lookups
  @@index([role])   // For role-based queries
}
```

**Apply Indexes:**
```bash
# After adding indexes to schema.prisma
npx prisma generate
npx prisma db push

# Or for production with migrations
npx prisma migrate dev --name add_performance_indexes
```

**Expected Impact:**
- Search queries: 50-80% faster
- Filter queries: 40-70% faster
- Relation lookups: 60-90% faster
- Pagination: 30-50% faster

---

### 1.2 Optimize Prisma Queries ✅

**Current Implementation Review:**

#### Good Practices Already Implemented:
✅ Using `include` for relations instead of separate queries
✅ Using `select` to limit fields when appropriate
✅ Pagination with `skip` and `take`
✅ Filtering with `where` clauses
✅ Soft delete with `deletedAt` checks

#### Optimization Opportunities:

**1. Reduce Over-fetching:**
```typescript
// BEFORE: Fetching all fields
const students = await prisma.student.findMany({
  include: {
    parent: true,
    class: true,
  }
})

// AFTER: Select only needed fields
const students = await prisma.student.findMany({
  select: {
    id: true,
    nis: true,
    name: true,
    status: true,
    parent: {
      select: {
        id: true,
        user: {
          select: {
            name: true,
          }
        }
      }
    },
    class: {
      select: {
        id: true,
        name: true,
        grade: true,
      }
    }
  }
})
```

**2. Use Transactions for Multiple Operations:**
```typescript
// BEFORE: Multiple separate queries
await prisma.student.create({ data: studentData })
await logActivity({ action: 'CREATE', entity: 'Student' })

// AFTER: Single transaction
await prisma.$transaction([
  prisma.student.create({ data: studentData }),
  prisma.activityLog.create({ data: logData })
])
```

**3. Batch Operations:**
```typescript
// BEFORE: Loop with individual creates
for (const student of students) {
  await prisma.student.create({ data: student })
}

// AFTER: Batch create
await prisma.student.createMany({
  data: students,
  skipDuplicates: true
})
```

**4. Connection Pooling:**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 2. Query Result Caching

### 2.1 Implement React Query (Optional)

**Install Dependencies:**
```bash
npm install @tanstack/react-query
```

**Setup Provider:**
```typescript
// src/app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Use in Components:**
```typescript
// Example: Student list with caching
import { useQuery } from '@tanstack/react-query'

function StudentList() {
  const { data, isLoading } = useQuery({
    queryKey: ['students', page, search],
    queryFn: () => getStudents({ page, search }),
    staleTime: 30 * 1000, // 30 seconds
  })
  
  // Component logic
}
```

**Benefits:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

---

### 2.2 Server-Side Caching (Advanced)

**Using Next.js Cache:**
```typescript
// Server action with caching
import { unstable_cache } from 'next/cache'

export const getStudents = unstable_cache(
  async (filters) => {
    return await prisma.student.findMany({
      where: filters,
    })
  },
  ['students'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['students'],
  }
)

// Invalidate cache when data changes
import { revalidateTag } from 'next/cache'

export async function createStudent(data) {
  const student = await prisma.student.create({ data })
  revalidateTag('students')
  return student
}
```

---

## 3. Image Optimization

### 3.1 Optimize Student Photos

**Current Implementation:**
- Photos stored as URLs
- No optimization

**Recommended Improvements:**

**1. Use Next.js Image Component:**
```typescript
import Image from 'next/image'

// Instead of <img>
<Image
  src={student.photo}
  alt={student.name}
  width={200}
  height={200}
  className="rounded-full"
  loading="lazy"
/>
```

**2. Image Upload Optimization:**
```typescript
// Compress images before upload
import imageCompression from 'browser-image-compression'

async function handleImageUpload(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true
  }
  
  const compressedFile = await imageCompression(file, options)
  // Upload compressed file
}
```

**3. Use CDN for Images:**
- Store images in cloud storage (AWS S3, Cloudinary, etc.)
- Serve via CDN for faster delivery
- Automatic image optimization

---

## 4. Code Splitting & Lazy Loading

### 4.1 Dynamic Imports ✅

**Already Implemented:**
- Modal components loaded on demand
- Form components loaded when needed

**Additional Opportunities:**

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const FinancialReport = dynamic(
  () => import('./components/FinancialReport'),
  { loading: () => <LoadingSpinner /> }
)

const ActivityGallery = dynamic(
  () => import('./components/ActivityGallery'),
  { ssr: false } // Client-side only
)
```

---

### 4.2 Route-based Code Splitting ✅

**Already Implemented:**
- Next.js automatically splits code by route
- Each page is a separate bundle

**Verify Bundle Sizes:**
```bash
npm run build

# Check output for bundle sizes
# Look for pages > 200KB
```

---

## 5. Frontend Optimization

### 5.1 Debounce Search Inputs ✅

**Already Implemented:**
```typescript
// Search with debouncing
const [searchTerm, setSearchTerm] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    // Perform search
  }, 300)
  
  return () => clearTimeout(timer)
}, [searchTerm])
```

---

### 5.2 Virtualize Long Lists (Optional)

**For lists with 1000+ items:**

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window'

function StudentList({ students }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <StudentCard student={students[index]} />
    </div>
  )
  
  return (
    <FixedSizeList
      height={600}
      itemCount={students.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

---

### 5.3 Optimize Re-renders

**Use React.memo for expensive components:**
```typescript
import { memo } from 'react'

const StudentCard = memo(({ student }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.student.id === nextProps.student.id
})
```

**Use useCallback for event handlers:**
```typescript
const handleDelete = useCallback((id: string) => {
  // Delete logic
}, [])
```

---

## 6. Build Optimization

### 6.1 Production Build Configuration

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig
```

---

### 6.2 Analyze Bundle Size

```bash
# Install analyzer
npm install @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true npm run build
```

---

## 7. Network Optimization

### 7.1 Enable Compression

**Vercel (Automatic):**
- Gzip/Brotli compression enabled by default

**Custom Server:**
```javascript
// server.js
const compression = require('compression')
app.use(compression())
```

---

### 7.2 HTTP/2 & HTTP/3

**Vercel (Automatic):**
- HTTP/2 enabled by default
- HTTP/3 (QUIC) available

**Custom Server:**
- Use nginx or Apache with HTTP/2 support
- Configure SSL/TLS certificates

---

### 7.3 CDN Configuration

**Vercel Edge Network:**
- Automatic global CDN
- Edge caching
- DDoS protection

**Custom CDN:**
- CloudFlare
- AWS CloudFront
- Fastly

---

## 8. Monitoring & Profiling

### 8.1 Performance Monitoring

**Install Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

### 8.2 Core Web Vitals

**Monitor:**
- LCP (Largest Contentful Paint) - Target: < 2.5s
- FID (First Input Delay) - Target: < 100ms
- CLS (Cumulative Layout Shift) - Target: < 0.1

**Tools:**
- Lighthouse
- PageSpeed Insights
- Chrome DevTools

---

### 8.3 Database Query Monitoring

**Enable Prisma Logging:**
```typescript
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

---

## 9. Implementation Checklist

### Database Optimization
- [ ] Add indexes to frequently queried fields
- [ ] Optimize Prisma queries with select
- [ ] Implement batch operations where applicable
- [ ] Configure connection pooling
- [ ] Test query performance

### Caching
- [ ] Implement React Query (optional)
- [ ] Configure Next.js cache
- [ ] Set appropriate cache durations
- [ ] Implement cache invalidation

### Image Optimization
- [ ] Use Next.js Image component
- [ ] Compress images before upload
- [ ] Configure CDN for images
- [ ] Implement lazy loading

### Code Optimization
- [ ] Implement dynamic imports for heavy components
- [ ] Verify bundle sizes
- [ ] Optimize re-renders with memo/useCallback
- [ ] Implement virtualization for long lists (if needed)

### Build Configuration
- [ ] Configure next.config.js for production
- [ ] Enable compression
- [ ] Remove console logs in production
- [ ] Analyze bundle size

### Monitoring
- [ ] Set up performance monitoring
- [ ] Monitor Core Web Vitals
- [ ] Set up database query monitoring
- [ ] Configure alerts for performance issues

---

## 10. Performance Targets

### Page Load Times
- Dashboard: < 2 seconds
- Student List: < 2 seconds
- Teacher List: < 1.5 seconds
- Class List: < 1.5 seconds
- Finance Reports: < 3 seconds

### API Response Times
- Simple queries: < 200ms
- Complex queries with relations: < 500ms
- Bulk operations: < 2 seconds
- Report generation: < 5 seconds

### Database Query Times
- Indexed queries: < 50ms
- Full-text search: < 100ms
- Aggregations: < 200ms
- Complex joins: < 300ms

---

## 11. Quick Wins (Immediate Impact)

### Priority 1 (High Impact, Low Effort):
1. ✅ Add database indexes
2. ✅ Enable compression
3. ✅ Use Next.js Image component
4. ✅ Configure production build settings

### Priority 2 (Medium Impact, Medium Effort):
1. ⚠️  Implement React Query
2. ⚠️  Optimize Prisma queries
3. ⚠️  Set up performance monitoring
4. ⚠️  Analyze and reduce bundle size

### Priority 3 (High Impact, High Effort):
1. ⚠️  Implement CDN for assets
2. ⚠️  Add server-side caching
3. ⚠️  Implement virtualization
4. ⚠️  Set up advanced monitoring

---

## Summary

### Current Performance Status:
- ✅ Good foundation with Next.js
- ✅ Server-side rendering enabled
- ✅ Code splitting by route
- ✅ Debounced search inputs
- ⚠️  Database indexes needed
- ⚠️  Image optimization needed
- ⚠️  Caching strategy needed

### Recommended Next Steps:
1. Add database indexes (30 minutes)
2. Configure production build (15 minutes)
3. Implement image optimization (1 hour)
4. Set up monitoring (30 minutes)
5. Test and measure improvements

### Expected Improvements:
- Page load time: 40-60% faster
- Database queries: 50-80% faster
- Bundle size: 20-30% smaller
- User experience: Significantly improved

---

Last Updated: 2026-02-15
Status: Recommendations provided, implementation pending
