# 📁 Project Structure

Dokumentasi lengkap struktur folder dan file AL-AMIN School Management System.

## 📂 Root Directory

```
asms-alamin/
├── .next/                      # Next.js build output (auto-generated)
├── node_modules/               # Dependencies (auto-generated)
├── prisma/                     # Database schema & migrations
├── public/                     # Static assets
├── src/                        # Source code
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── API.md                      # API documentation
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
├── DATABASE.md                 # Database documentation
├── DEPLOYMENT.md               # Deployment guides
├── FEATURES.md                 # Feature list
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies & scripts
├── postcss.config.js           # PostCSS configuration
├── PROJECT_STRUCTURE.md        # This file
├── README.md                   # Main documentation
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 📂 Prisma Directory

```
prisma/
├── migrations/                 # Database migrations (auto-generated)
├── schema.prisma              # Database schema definition
└── seed.ts                    # Seed data script
```

### Files Description

- **schema.prisma**: Definisi schema database dengan Prisma ORM
- **seed.ts**: Script untuk populate database dengan data dummy
- **migrations/**: History perubahan database schema

---

## 📂 Public Directory

```
public/
├── uploads/                   # User uploaded files
│   ├── photos/               # Student/teacher photos
│   ├── documents/            # SPMB documents
│   └── activities/           # Activity photos
├── images/                    # Static images
│   ├── logo.png              # School logo
│   ├── hero-bg.jpg           # Hero background
│   └── patterns/             # Islamic patterns
├── fonts/                     # Custom fonts (if any)
└── favicon.ico               # Favicon
```

### Files Description

- **uploads/**: User-generated content (gitignored)
- **images/**: Static images untuk landing page
- **favicon.ico**: Browser tab icon

---

## 📂 Source Directory

```
src/
├── app/                       # Next.js App Router
├── components/                # React components
├── lib/                       # Utility libraries
├── types/                     # TypeScript types
└── middleware.ts              # Next.js middleware
```

---

## 📂 App Directory (Routes)

```
src/app/
├── (landing)/                 # Landing page group
│   ├── page.tsx              # Home page
│   └── layout.tsx            # Landing layout
├── dashboard/                 # Dashboard routes
│   ├── page.tsx              # Dashboard home
│   ├── layout.tsx            # Dashboard layout
│   ├── students/             # Students module
│   │   ├── page.tsx          # Students list
│   │   ├── [id]/             # Student detail
│   │   │   └── page.tsx
│   │   └── new/              # Add student
│   │       └── page.tsx
│   ├── teachers/             # Teachers module
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── classes/              # Classes module
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── spmb/                 # SPMB module
│   │   ├── page.tsx          # Applicants list
│   │   ├── [id]/             # Applicant detail
│   │   │   └── page.tsx
│   │   └── ranking/          # Ranking page
│   │       └── page.tsx
│   ├── finance/              # Finance module
│   │   ├── page.tsx          # Invoices list
│   │   ├── invoices/
│   │   │   └── page.tsx
│   │   ├── payments/
│   │   │   └── page.tsx
│   │   └── reports/
│   │       └── page.tsx
│   ├── academic/             # Academic module
│   │   ├── page.tsx
│   │   ├── announcements/
│   │   │   └── page.tsx
│   │   ├── activities/
│   │   │   └── page.tsx
│   │   └── calendar/
│   │       └── page.tsx
│   └── settings/             # Settings module
│       ├── page.tsx
│       ├── profile/
│       │   └── page.tsx
│       ├── users/
│       │   └── page.tsx
│       └── system/
│           └── page.tsx
├── spmb/                      # Public SPMB routes
│   ├── register/             # Registration form
│   │   └── page.tsx
│   └── check/                # Check admission
│       └── page.tsx
├── login/                     # Login page
│   └── page.tsx
├── api/                       # API routes
│   ├── auth/                 # Authentication
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── students/             # Students API
│   │   ├── route.ts          # GET, POST
│   │   └── [id]/
│   │       └── route.ts      # GET, PUT, DELETE
│   ├── teachers/             # Teachers API
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── classes/              # Classes API
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   ├── spmb/                 # SPMB API
│   │   ├── register/
│   │   │   └── route.ts
│   │   ├── applicants/
│   │   │   └── route.ts
│   │   └── check/
│   │       └── route.ts
│   ├── finance/              # Finance API
│   │   ├── invoices/
│   │   │   └── route.ts
│   │   ├── payments/
│   │   │   └── route.ts
│   │   └── reports/
│   │       └── route.ts
│   ├── academic/             # Academic API
│   │   ├── announcements/
│   │   │   └── route.ts
│   │   └── activities/
│   │       └── route.ts
│   ├── upload/               # File upload
│   │   └── route.ts
│   └── export/               # Export data
│       └── route.ts
├── globals.css               # Global styles
└── layout.tsx                # Root layout
```

### Route Groups

- **(landing)**: Public landing page
- **dashboard**: Protected admin area
- **spmb**: Public SPMB pages
- **api**: API endpoints

---

## 📂 Components Directory

```
src/components/
├── landing/                   # Landing page components
│   ├── Navbar.tsx            # Navigation bar
│   ├── HeroSection.tsx       # Hero section
│   ├── ProfileSection.tsx    # Profile section
│   ├── ProgramSection.tsx    # Programs section
│   ├── StatsSection.tsx      # Statistics section
│   ├── GallerySection.tsx    # Gallery section
│   ├── SPMBSection.tsx       # SPMB section
│   ├── TestimonialSection.tsx # Testimonials
│   └── Footer.tsx            # Footer
├── dashboard/                 # Dashboard components
│   ├── Sidebar.tsx           # Sidebar navigation
│   ├── Header.tsx            # Top header
│   ├── StatsCard.tsx         # Statistics card
│   ├── PaymentChart.tsx      # Payment chart
│   └── RecentActivities.tsx  # Recent activities
├── students/                  # Student components
│   ├── StudentList.tsx       # Students table
│   ├── StudentCard.tsx       # Student card
│   ├── StudentForm.tsx       # Add/edit form
│   └── StudentDetail.tsx     # Detail view
├── teachers/                  # Teacher components
│   ├── TeacherList.tsx
│   ├── TeacherCard.tsx
│   └── TeacherForm.tsx
├── classes/                   # Class components
│   ├── ClassList.tsx
│   ├── ClassCard.tsx
│   └── ClassForm.tsx
├── spmb/                      # SPMB components
│   ├── RegistrationForm.tsx  # Multi-step form
│   ├── ApplicantList.tsx     # Applicants table
│   ├── ApplicantCard.tsx     # Applicant card
│   └── RankingTable.tsx      # Ranking table
├── finance/                   # Finance components
│   ├── InvoiceList.tsx       # Invoices table
│   ├── InvoiceCard.tsx       # Invoice card
│   ├── PaymentForm.tsx       # Payment form
│   └── ReportChart.tsx       # Report chart
├── academic/                  # Academic components
│   ├── AnnouncementList.tsx  # Announcements
│   ├── ActivityList.tsx      # Activities
│   └── Calendar.tsx          # Calendar view
└── ui/                        # Reusable UI components
    ├── Button.tsx            # Button component
    ├── Input.tsx             # Input field
    ├── Select.tsx            # Select dropdown
    ├── Modal.tsx             # Modal dialog
    ├── Toast.tsx             # Toast notification
    ├── Card.tsx              # Card component
    ├── Table.tsx             # Table component
    ├── Pagination.tsx        # Pagination
    ├── Loading.tsx           # Loading spinner
    └── ErrorBoundary.tsx     # Error boundary
```

### Component Organization

- **landing/**: Landing page specific
- **dashboard/**: Dashboard layout components
- **[module]/**: Module-specific components
- **ui/**: Reusable UI components

---

## 📂 Lib Directory

```
src/lib/
├── prisma.ts                  # Prisma client instance
├── auth.ts                    # NextAuth configuration
├── utils.ts                   # Utility functions
├── validations.ts             # Zod schemas
├── constants.ts               # App constants
└── hooks/                     # Custom React hooks
    ├── useAuth.ts            # Auth hook
    ├── useDebounce.ts        # Debounce hook
    └── useLocalStorage.ts    # Local storage hook
```

### Files Description

- **prisma.ts**: Singleton Prisma client
- **auth.ts**: NextAuth.js configuration
- **utils.ts**: Helper functions (formatCurrency, formatDate, etc.)
- **validations.ts**: Zod validation schemas
- **constants.ts**: App-wide constants
- **hooks/**: Custom React hooks

---

## 📂 Types Directory

```
src/types/
├── index.ts                   # Main types export
├── student.ts                 # Student types
├── teacher.ts                 # Teacher types
├── class.ts                   # Class types
├── spmb.ts                    # SPMB types
├── finance.ts                 # Finance types
├── academic.ts                # Academic types
└── api.ts                     # API response types
```

### Type Organization

- Each module has its own type file
- **index.ts** exports all types
- Extends Prisma generated types when needed

---

## 🎯 File Naming Conventions

### React Components
- **PascalCase**: `StudentCard.tsx`
- **Descriptive names**: `StudentList.tsx` not `List.tsx`
- **Suffix with type**: `StudentForm.tsx`, `StudentCard.tsx`

### API Routes
- **kebab-case**: `route.ts` in folder structure
- **RESTful naming**: `/api/students`, `/api/students/[id]`

### Utility Files
- **camelCase**: `utils.ts`, `validations.ts`
- **Descriptive names**: `formatCurrency.ts` not `format.ts`

### CSS Files
- **kebab-case**: `globals.css`, `student-card.css`

---

## 📦 Module Structure Example

Contoh struktur lengkap untuk modul Students:

```
students/
├── page.tsx                   # List page (route)
├── [id]/
│   └── page.tsx              # Detail page (route)
├── new/
│   └── page.tsx              # Add page (route)
└── components/                # Module components
    ├── StudentList.tsx       # Table component
    ├── StudentCard.tsx       # Card component
    ├── StudentForm.tsx       # Form component
    ├── StudentDetail.tsx     # Detail component
    └── StudentFilters.tsx    # Filters component
```

---

## 🔧 Configuration Files

### next.config.js
```javascript
// Next.js configuration
// - Image domains
// - Environment variables
// - Build settings
```

### tailwind.config.ts
```typescript
// Tailwind CSS configuration
// - Theme customization
// - Colors, fonts, spacing
// - Plugins
```

### tsconfig.json
```json
// TypeScript configuration
// - Compiler options
// - Path aliases
// - Strict mode
```

### prisma/schema.prisma
```prisma
// Database schema
// - Models
// - Relations
// - Indexes
```

---

## 📝 Best Practices

### File Organization

1. **Group by feature**: Organize files by feature/module
2. **Colocation**: Keep related files together
3. **Flat structure**: Avoid deep nesting (max 3 levels)
4. **Clear naming**: Use descriptive, consistent names

### Component Structure

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

// 2. Types
interface StudentCardProps {
  student: Student;
  onEdit: (id: string) => void;
}

// 3. Component
export default function StudentCard({ student, onEdit }: StudentCardProps) {
  // 4. State & hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Handlers
  const handleEdit = () => {
    onEdit(student.id);
  };

  // 6. Render
  return (
    <div className="card">
      {/* JSX */}
    </div>
  );
}
```

### API Route Structure

```typescript
// 1. Imports
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 2. GET handler
export async function GET(request: NextRequest) {
  try {
    // Logic
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// 3. POST handler
export async function POST(request: NextRequest) {
  // Similar structure
}
```

---

## 🚀 Adding New Features

### Step-by-Step Guide

1. **Create route** in `src/app/`
2. **Create components** in `src/components/`
3. **Create API** in `src/app/api/`
4. **Add types** in `src/types/`
5. **Update database** in `prisma/schema.prisma`
6. **Add navigation** in Sidebar
7. **Update documentation**

### Example: Adding "Library" Module

```
1. Create routes:
   src/app/dashboard/library/page.tsx
   src/app/dashboard/library/[id]/page.tsx

2. Create components:
   src/components/library/BookList.tsx
   src/components/library/BookCard.tsx
   src/components/library/BookForm.tsx

3. Create API:
   src/app/api/library/route.ts
   src/app/api/library/[id]/route.ts

4. Add types:
   src/types/library.ts

5. Update database:
   prisma/schema.prisma (add Book model)

6. Update Sidebar:
   src/components/dashboard/Sidebar.tsx

7. Update docs:
   README.md, FEATURES.md, API.md
```

---

## 📚 Additional Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Component Patterns](https://reactpatterns.com/)

---

**Note**: Struktur ini dapat berkembang seiring dengan penambahan fitur baru. Selalu update dokumentasi ini saat ada perubahan struktur signifikan.
