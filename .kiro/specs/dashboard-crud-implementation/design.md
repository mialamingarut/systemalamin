# Design Document: Dashboard CRUD Implementation

## Overview

This design document outlines the implementation of comprehensive CRUD functionality for the AL-AMIN School Management System dashboard. The system follows Next.js 14 App Router architecture with Server Actions for data mutations, Prisma ORM for database operations, and Zod for validation. The implementation emphasizes type safety, optimistic UI updates, and responsive design.

The system is organized into seven main modules: Students, Teachers, Classes, SPMB (new student registration), Finance, Academic, and Settings. Each module follows a consistent pattern of list views, forms, modals, and server actions.

## Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth 5
- **Validation**: Zod schemas
- **UI Components**: React with Tailwind CSS
- **State Management**: React hooks for client state, Server Actions for server state
- **File Processing**: xlsx for Excel, jspdf for PDF generation

### Directory Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── students/
│   │   │   ├── page.tsx              # Student list page
│   │   │   ├── actions.ts            # Student server actions
│   │   │   └── components/           # Student-specific components
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── spmb/
│   │   ├── finance/
│   │   ├── academic/
│   │   └── settings/
│   └── api/                          # API routes for file uploads
├── components/
│   ├── ui/                           # Reusable UI components
│   │   ├── Modal.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Toast.tsx
│   │   └── Table.tsx
│   └── dashboard/                    # Dashboard-specific components
├── lib/
│   ├── prisma.ts                     # Prisma client
│   ├── validations.ts                # Zod schemas
│   ├── utils.ts                      # Utility functions
│   └── exports.ts                    # Export utilities
└── types/
    └── index.ts                      # TypeScript types
```


### Architectural Patterns

#### Server Actions Pattern

All data mutations use Next.js Server Actions for type-safe, server-side operations:

```typescript
'use server'

export async function createStudent(data: StudentFormData) {
  // 1. Validate session
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  
  // 2. Validate input with Zod
  const validated = studentSchema.parse(data)
  
  // 3. Perform database operation
  const student = await prisma.student.create({
    data: validated
  })
  
  // 4. Log activity
  await logActivity({
    userId: session.user.id,
    action: 'CREATE',
    entity: 'Student',
    entityId: student.id
  })
  
  // 5. Revalidate cache
  revalidatePath('/dashboard/students')
  
  return { success: true, data: student }
}
```

#### Optimistic UI Pattern

Client components implement optimistic updates for immediate feedback:

```typescript
const [students, setStudents] = useState(initialStudents)

async function handleDelete(id: string) {
  // Optimistic update
  setStudents(prev => prev.filter(s => s.id !== id))
  
  try {
    await deleteStudent(id)
    toast.success('Student deleted')
  } catch (error) {
    // Revert on error
    setStudents(initialStudents)
    toast.error('Failed to delete student')
  }
}
```

#### Modal Pattern

Forms are displayed in modals for consistent UX:

```typescript
<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <StudentForm
    mode="create"
    onSuccess={() => {
      setIsOpen(false)
      refreshData()
    }}
  />
</Modal>
```


## Components and Interfaces

### Core UI Components

#### Modal Component

```typescript
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  // Renders overlay with dialog
  // Handles escape key and backdrop click
  // Manages focus trap
}
```

#### Toast Component

```typescript
interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// Global toast manager
const toast = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}
```

#### Table Component

```typescript
interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: PaginationConfig
  onRowClick?: (row: T) => void
  loading?: boolean
}

interface ColumnDef<T> {
  key: keyof T
  header: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}
```

#### Form Input Components

```typescript
interface InputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
}

interface SelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  error?: string
  required?: boolean
}
```


### Module-Specific Components

#### Student Module Components

**StudentList Component**
```typescript
interface StudentListProps {
  initialStudents: StudentWithRelations[]
  totalCount: number
  currentPage: number
}

// Displays paginated student table
// Handles search, filter, and pagination
// Manages optimistic updates
```

**StudentForm Component**
```typescript
interface StudentFormProps {
  mode: 'create' | 'edit'
  initialData?: Student
  onSuccess: () => void
  onCancel: () => void
}

// Renders form with validation
// Handles file uploads for photos
// Submits to server actions
```

**StudentDetail Component**
```typescript
interface StudentDetailProps {
  student: StudentWithRelations
  onEdit: () => void
  onClose: () => void
}

// Displays complete student information
// Shows class assignments and payment history
// Provides navigation to edit mode
```

#### Teacher Module Components

**TeacherCard Component**
```typescript
interface TeacherCardProps {
  teacher: TeacherWithUser
  onEdit: () => void
  onDelete: () => void
  onViewDetail: () => void
}

// Displays teacher information in card format
// Shows assigned subjects
// Provides action buttons
```

**SubjectAssignment Component**
```typescript
interface SubjectAssignmentProps {
  teacherId: string
  currentSubjects: string[]
  availableSubjects: string[]
  onUpdate: (subjects: string[]) => void
}

// Multi-select interface for subjects
// Handles add/remove operations
// Updates teacher record
```


#### Class Module Components

**ClassRoster Component**
```typescript
interface ClassRosterProps {
  classId: string
  currentStudents: Student[]
  availableStudents: Student[]
  capacity: number
  onUpdate: (studentIds: string[]) => void
}

// Displays current class roster
// Provides interface to add/remove students
// Enforces capacity limits
// Prevents double-assignment
```

#### Finance Module Components

**InvoiceGenerator Component**
```typescript
interface InvoiceGeneratorProps {
  academicYearId: string
  onGenerate: (month: number, year: number) => void
}

// Month/year selection form
// Displays generation summary
// Handles bulk invoice creation
```

**PaymentForm Component**
```typescript
interface PaymentFormProps {
  invoice: Invoice
  onSuccess: () => void
  onCancel: () => void
}

// Payment amount and date inputs
// Validates payment amount
// Updates invoice status
```

**FinancialReport Component**
```typescript
interface FinancialReportProps {
  reportType: 'monthly' | 'yearly' | 'by-class'
  filters: ReportFilters
}

// Displays financial statistics
// Renders charts with recharts
// Provides export options
```

#### SPMB Module Components

**ApplicantList Component**
```typescript
interface ApplicantListProps {
  applicants: SPMBApplicant[]
  onVerify: (id: string) => void
  onInputScore: (id: string, score: number) => void
  onApprove: (id: string) => void
  onReject: (id: string, notes: string) => void
}

// Displays applicants with status badges
// Provides action buttons based on status
// Handles status transitions
```

**RankingView Component**
```typescript
interface RankingViewProps {
  applicants: SPMBApplicant[]
  passingScore: number
}

// Displays sorted ranking list
// Highlights passing candidates
// Provides export functionality
```


#### Academic Module Components

**AnnouncementList Component**
```typescript
interface AnnouncementListProps {
  announcements: Announcement[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
}

// Displays announcements with pinned items first
// Provides CRUD actions
// Handles rich text content
```

**ActivityGallery Component**
```typescript
interface ActivityGalleryProps {
  activity: Activity
  onPhotoClick: (photoUrl: string) => void
}

// Displays activity photos in grid
// Opens lightbox on click
// Handles multiple photo uploads
```

#### Settings Module Components

**AcademicYearManager Component**
```typescript
interface AcademicYearManagerProps {
  academicYears: AcademicYear[]
  onSetActive: (id: string) => void
}

// Lists all academic years
// Highlights active year
// Handles activation toggle
```

**ConfigEditor Component**
```typescript
interface ConfigEditorProps {
  configs: SystemConfig[]
  onUpdate: (key: string, value: string) => void
}

// Groups configs by category
// Provides type-appropriate inputs
// Validates config values
```

**ActivityLogViewer Component**
```typescript
interface ActivityLogViewerProps {
  logs: ActivityLogWithUser[]
  filters: LogFilters
  onFilterChange: (filters: LogFilters) => void
}

// Displays paginated logs
// Provides filtering interface
// Exports to CSV
```


## Data Models

### TypeScript Types

```typescript
// Student types
type StudentWithRelations = Student & {
  parent: Parent & { user: User }
  classStudents: Array<ClassStudent & { class: Class }>
  invoices: Invoice[]
}

type StudentFormData = {
  nis: string
  nisn?: string
  name: string
  gender: Gender
  dateOfBirth: Date
  placeOfBirth: string
  address: string
  phone?: string
  photo?: string
  parentId: string
  enrollmentDate: Date
}

// Teacher types
type TeacherWithUser = Teacher & {
  user: User
  classes: Class[]
}

type TeacherFormData = {
  name: string
  email: string
  password?: string
  nip: string
  phone: string
  address: string
  dateOfBirth: Date
  gender: Gender
  joinDate: Date
  subjects: string[]
}

// Class types
type ClassWithRelations = Class & {
  teacher: Teacher & { user: User }
  students: Array<ClassStudent & { student: Student }>
  academicYear: AcademicYear
}

type ClassFormData = {
  name: string
  grade: number
  teacherId: string
  capacity: number
}

// Invoice types
type InvoiceWithRelations = Invoice & {
  student: Student
  academicYear: AcademicYear
}

type PaymentData = {
  paidAmount: number
  paidAt: Date
  notes?: string
}

// SPMB types
type SPMBApplicantWithYear = SPMBApplicant & {
  academicYear: AcademicYear
}

// Activity Log types
type ActivityLogWithUser = ActivityLog & {
  user: User
}

type LogFilters = {
  userId?: string
  action?: string
  entity?: string
  startDate?: Date
  endDate?: Date
}
```


### Validation Schemas

All forms use Zod schemas for validation:

```typescript
// Student validation
const studentSchema = z.object({
  nis: z.string().min(5, 'NIS must be at least 5 characters'),
  nisn: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.date(),
  placeOfBirth: z.string().min(2),
  address: z.string().min(10),
  phone: z.string().optional(),
  photo: z.string().url().optional(),
  parentId: z.string().cuid(),
  enrollmentDate: z.date()
})

// Teacher validation
const teacherSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  nip: z.string().min(10),
  phone: z.string().min(10),
  address: z.string().min(10),
  dateOfBirth: z.date(),
  gender: z.enum(['MALE', 'FEMALE']),
  joinDate: z.date(),
  subjects: z.array(z.string())
})

// Class validation
const classSchema = z.object({
  name: z.string().min(2),
  grade: z.number().int().min(1).max(6),
  teacherId: z.string().cuid(),
  capacity: z.number().int().min(1).max(50)
})

// Payment validation
const paymentSchema = z.object({
  paidAmount: z.number().positive(),
  paidAt: z.date(),
  notes: z.string().optional()
})

// SPMB score validation
const scoreSchema = z.object({
  testScore: z.number().min(0).max(100)
})

// Invoice generation validation
const invoiceGenerationSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100)
})
```


### Server Actions Interface

Each module has a dedicated actions file with consistent patterns:

```typescript
// Student actions (src/app/dashboard/students/actions.ts)
export async function getStudents(params: {
  page?: number
  search?: string
  classId?: string
  status?: boolean
}): Promise<{ students: StudentWithRelations[], total: number }>

export async function getStudentById(id: string): Promise<StudentWithRelations>

export async function createStudent(data: StudentFormData): Promise<ActionResult<Student>>

export async function updateStudent(id: string, data: StudentFormData): Promise<ActionResult<Student>>

export async function deleteStudent(id: string): Promise<ActionResult<void>>

export async function importStudents(file: File): Promise<ActionResult<{ imported: number, errors: string[] }>>

export async function exportStudents(format: 'excel' | 'pdf', filters: any): Promise<Blob>

// Teacher actions
export async function getTeachers(search?: string): Promise<TeacherWithUser[]>

export async function createTeacher(data: TeacherFormData): Promise<ActionResult<Teacher>>

export async function updateTeacher(id: string, data: TeacherFormData): Promise<ActionResult<Teacher>>

export async function deleteTeacher(id: string): Promise<ActionResult<void>>

export async function updateTeacherSubjects(id: string, subjects: string[]): Promise<ActionResult<Teacher>>

// Class actions
export async function getClasses(academicYearId: string, grade?: number): Promise<ClassWithRelations[]>

export async function createClass(data: ClassFormData): Promise<ActionResult<Class>>

export async function updateClass(id: string, data: ClassFormData): Promise<ActionResult<Class>>

export async function deleteClass(id: string): Promise<ActionResult<void>>

export async function updateClassRoster(classId: string, studentIds: string[]): Promise<ActionResult<void>>

// Finance actions
export async function generateInvoices(month: number, year: number): Promise<ActionResult<{ count: number }>>

export async function recordPayment(invoiceId: string, data: PaymentData): Promise<ActionResult<Invoice>>

export async function getFinancialReport(type: string, filters: any): Promise<ReportData>

// SPMB actions
export async function verifyApplicant(id: string): Promise<ActionResult<SPMBApplicant>>

export async function inputTestScore(id: string, score: number): Promise<ActionResult<SPMBApplicant>>

export async function approveApplicant(id: string): Promise<ActionResult<SPMBApplicant>>

export async function rejectApplicant(id: string, notes: string): Promise<ActionResult<SPMBApplicant>>

export async function generateRanking(): Promise<SPMBApplicant[]>

// Common action result type
type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

- Criteria 2.4 and 3.4 both test validation error display - these can be combined into one property about validation
- Multiple criteria test uniqueness constraints (NIS, NIP, email, class names) - these follow the same pattern
- Multiple criteria test business rule constraints (deletion prevention) - these follow the same pattern
- Export criteria 7.2, 7.3, 7.4, 7.5 can be combined into comprehensive export properties
- Logging criteria 41.1, 41.2, 41.3 can be combined into one comprehensive logging property

### Data Filtering and Search Properties

Property 1: Search filter correctness
*For any* collection of students and any search query, all returned students should have the search term present in their name, NIS, or parent name (case-insensitive).
**Validates: Requirements 1.2**

Property 2: Class filter correctness
*For any* collection of students and any class ID filter, all returned students should be assigned to that specific class.
**Validates: Requirements 1.3**

Property 3: Status filter correctness
*For any* collection of students and any status filter value, all returned students should have a matching isActive status.
**Validates: Requirements 1.4**

Property 4: Pagination correctness
*For any* collection of students and any page number, the returned subset should contain exactly 20 students (or fewer for the last page) starting at the correct offset.
**Validates: Requirements 1.6**


### CRUD Operation Properties

Property 5: Uniqueness constraint enforcement
*For any* entity type with a unique field (Student.nis, Teacher.nip, User.email, Class.name+academicYearId, AcademicYear.name), attempting to create or update a record with a duplicate value should fail with a validation error.
**Validates: Requirements 2.2, 3.2, 9.2, 9.3, 14.2, 32.4**

Property 6: Required field validation
*For any* entity creation with missing required fields, the validation should fail and return specific error messages for each missing field.
**Validates: Requirements 2.4, 2.5, 3.4**

Property 7: Optional field acceptance
*For any* entity creation with all required fields but no optional fields, the creation should succeed and the record should be created with null/undefined optional values.
**Validates: Requirements 2.6**

Property 8: Successful creation persistence
*For any* valid entity data, after successful creation, querying the database for that entity by its ID should return the created record with all provided field values.
**Validates: Requirements 2.3, 3.3, 9.4**

Property 9: Soft delete behavior
*For any* entity that supports soft delete, after deletion, the entity should have a non-null deletedAt timestamp and should not appear in queries for active records.
**Validates: Requirements 4.2**

Property 10: Related record creation
*For any* teacher creation with valid data, both a User record and a Teacher record should be created, linked by userId, and the User should have role set to TEACHER.
**Validates: Requirements 9.4, 9.7**


### Business Rule Properties

Property 11: Deletion constraint enforcement
*For any* entity with dependent records (Student with unpaid invoices, Teacher with active classes, Class with assigned students), attempting to delete the entity should fail with an appropriate error message.
**Validates: Requirements 4.6, 11.3, 16.3**

Property 12: Class capacity enforcement
*For any* class with a defined capacity, attempting to assign more students than the capacity should fail with a capacity exceeded error.
**Validates: Requirements 17.6**

Property 13: Single class assignment per academic year
*For any* student and academic year, the student should be assigned to at most one class within that academic year.
**Validates: Requirements 17.5**

Property 14: Score range validation
*For any* test score input, values outside the range [0, 100] should be rejected with a validation error.
**Validates: Requirements 20.2**

Property 15: Single active academic year
*For any* academic year set to active, all other academic years should have isActive set to false.
**Validates: Requirements 32.7**

Property 16: Date range validation
*For any* academic year, the startDate should be before the endDate, and attempting to create or update with invalid date ranges should fail.
**Validates: Requirements 32.5**

Property 17: Partial payment status
*For any* invoice payment where paidAmount is less than the invoice amount, the invoice status should remain PENDING; when paidAmount equals or exceeds amount, status should be PAID.
**Validates: Requirements 25.8**


### Import and Export Properties

Property 18: File format validation
*For any* file upload for student import, files with extensions .xlsx or .xls should be accepted, and files with other extensions should be rejected.
**Validates: Requirements 6.2**

Property 19: Import structure validation
*For any* Excel file uploaded for import, if the file structure does not match the expected template (missing required columns), the import should fail with a structure validation error.
**Validates: Requirements 6.3**

Property 20: Import row validation
*For any* Excel file with multiple rows, each row should be validated independently, and rows with invalid data should be collected in an error report with row numbers.
**Validates: Requirements 6.4, 6.6**

Property 21: Import duplicate handling
*For any* Excel file containing rows with NIS values that already exist in the database, those rows should be skipped and reported in the import summary.
**Validates: Requirements 6.8**

Property 22: Import success count
*For any* Excel file with valid rows, the number of created student records should equal the number of valid, non-duplicate rows.
**Validates: Requirements 6.5**

Property 23: Export data consistency
*For any* export operation (Excel or PDF) with active filters, the exported data should contain exactly the same records as displayed in the filtered list view.
**Validates: Requirements 7.2, 7.3, 7.5**

Property 24: Export field completeness
*For any* export operation, all visible columns from the list view should be present in the exported file.
**Validates: Requirements 7.4**

Property 25: Export filename timestamp
*For any* export operation, the generated filename should contain a timestamp in a parseable format.
**Validates: Requirements 7.7**


### Invoice and Payment Properties

Property 26: Invoice number format and uniqueness
*For any* generated invoice, the invoice number should follow the format INV-YYYYMM-XXXX where YYYY is the year, MM is the month, and XXXX is a unique sequential or random number, and all invoice numbers should be unique.
**Validates: Requirements 24.3**

Property 27: Invoice duplicate prevention
*For any* student, month, year, and academic year combination, at most one invoice should exist; attempting to generate a duplicate invoice should skip that student.
**Validates: Requirements 24.6**

### Validation Properties

Property 28: Email format validation
*For any* email field input, values that do not match standard email format (user@domain.tld) should be rejected with a validation error.
**Validates: Requirements 36.3**

Property 29: Phone format validation
*For any* phone field input, values that do not match the expected phone number format should be rejected with a validation error.
**Validates: Requirements 36.4**

Property 30: Zod schema validation application
*For any* form submission, the input data should be validated against the corresponding Zod schema before processing, and validation failures should prevent the operation.
**Validates: Requirements 36.1**


### Activity Logging Properties

Property 31: Comprehensive action logging
*For any* create, update, or delete operation on any entity, an ActivityLog record should be created containing the userId, action type, entity type, entity ID, and timestamp.
**Validates: Requirements 41.1, 41.2, 41.3**

## Error Handling

### Error Types and Handling Strategy

**Validation Errors**
- Caught at the Zod schema level
- Return structured error objects with field-level messages
- HTTP status: 400 Bad Request
- Example: `{ success: false, error: 'Validation failed', fieldErrors: { nis: 'NIS must be unique' } }`

**Authentication Errors**
- Caught by NextAuth middleware
- Redirect to login page for unauthenticated requests
- HTTP status: 401 Unauthorized
- Example: `{ success: false, error: 'Authentication required' }`

**Authorization Errors**
- Checked in server actions based on user role
- Return error message
- HTTP status: 403 Forbidden
- Example: `{ success: false, error: 'Insufficient permissions' }`

**Database Errors**
- Caught in try-catch blocks around Prisma operations
- Log detailed error for debugging
- Return user-friendly message
- HTTP status: 500 Internal Server Error
- Example: `{ success: false, error: 'Failed to create student. Please try again.' }`

**Business Rule Violations**
- Checked explicitly before operations
- Return specific error messages
- HTTP status: 400 Bad Request
- Example: `{ success: false, error: 'Cannot delete student with unpaid invoices' }`

**File Processing Errors**
- Caught during import/export operations
- Return detailed error report
- HTTP status: 400 Bad Request
- Example: `{ success: false, error: 'Import failed', details: ['Row 5: Invalid date format'] }`


### Error Handling Implementation

```typescript
// Server action error handling pattern
export async function createStudent(data: StudentFormData): Promise<ActionResult<Student>> {
  try {
    // 1. Authentication check
    const session = await auth()
    if (!session) {
      return { success: false, error: 'Authentication required' }
    }
    
    // 2. Authorization check
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return { success: false, error: 'Insufficient permissions' }
    }
    
    // 3. Validation
    const validated = studentSchema.parse(data)
    
    // 4. Business rule checks
    const existingStudent = await prisma.student.findUnique({
      where: { nis: validated.nis }
    })
    if (existingStudent) {
      return { success: false, error: 'NIS already exists' }
    }
    
    // 5. Database operation
    const student = await prisma.student.create({
      data: validated
    })
    
    // 6. Activity logging
    await logActivity({
      userId: session.user.id,
      action: 'CREATE',
      entity: 'Student',
      entityId: student.id
    })
    
    // 7. Cache revalidation
    revalidatePath('/dashboard/students')
    
    return { success: true, data: student }
    
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors
      }
    }
    
    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Unique constraint violation' }
      }
    }
    
    // Generic errors
    console.error('Create student error:', error)
    return { success: false, error: 'Failed to create student' }
  }
}
```


## Testing Strategy

### Dual Testing Approach

The system requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of CRUD operations
- Edge cases (empty strings, boundary values, null handling)
- Error conditions (network failures, database errors)
- Integration between components
- UI component rendering and interactions

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Validation rules across random data
- Business logic consistency
- Data integrity constraints
- Comprehensive input coverage through randomization

Together, unit tests catch concrete bugs while property tests verify general correctness.

### Property-Based Testing Configuration

**Library Selection**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `Feature: dashboard-crud-implementation, Property {number}: {property_text}`

**Example Property Test**:

```typescript
import fc from 'fast-check'
import { describe, it, expect } from 'vitest'

describe('Feature: dashboard-crud-implementation, Property 1: Search filter correctness', () => {
  it('should return only students matching search term in name, NIS, or parent name', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(studentArbitrary, { minLength: 10, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        async (students, searchTerm) => {
          // Setup: Insert students into test database
          await prisma.student.createMany({ data: students })
          
          // Execute: Search with term
          const results = await getStudents({ search: searchTerm })
          
          // Verify: All results match search term
          results.students.forEach(student => {
            const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesNIS = student.nis.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesParent = student.parent.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            
            expect(matchesName || matchesNIS || matchesParent).toBe(true)
          })
          
          // Cleanup
          await prisma.student.deleteMany()
        }
      ),
      { numRuns: 100 }
    )
  })
})
```


### Unit Testing Strategy

**Test Organization**:
- Co-locate tests with source files: `actions.test.ts` next to `actions.ts`
- Use Vitest as the test runner
- Mock Prisma client for isolated unit tests
- Use test database for integration tests

**Example Unit Test**:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStudent } from './actions'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      create: vi.fn(),
      findUnique: vi.fn()
    }
  }
}))

describe('createStudent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should create a student with valid data', async () => {
    const studentData = {
      nis: '2026001',
      name: 'Test Student',
      gender: 'MALE',
      dateOfBirth: new Date('2015-01-01'),
      placeOfBirth: 'Jakarta',
      address: 'Test Address',
      parentId: 'parent-id',
      enrollmentDate: new Date()
    }
    
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.student.create).mockResolvedValue({
      id: 'student-id',
      ...studentData
    })
    
    const result = await createStudent(studentData)
    
    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('id')
    expect(prisma.student.create).toHaveBeenCalledWith({
      data: studentData
    })
  })
  
  it('should reject duplicate NIS', async () => {
    const studentData = {
      nis: '2026001',
      name: 'Test Student',
      // ... other fields
    }
    
    vi.mocked(prisma.student.findUnique).mockResolvedValue({
      id: 'existing-id',
      nis: '2026001'
    })
    
    const result = await createStudent(studentData)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('NIS already exists')
    expect(prisma.student.create).not.toHaveBeenCalled()
  })
  
  it('should reject missing required fields', async () => {
    const invalidData = {
      nis: '2026001'
      // missing required fields
    }
    
    const result = await createStudent(invalidData)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('Validation failed')
  })
})
```


### Test Data Generators (Arbitraries)

For property-based testing, define arbitraries for each entity:

```typescript
import fc from 'fast-check'

// Student arbitrary
const studentArbitrary = fc.record({
  nis: fc.string({ minLength: 5, maxLength: 10 }),
  nisn: fc.option(fc.string({ minLength: 10, maxLength: 10 })),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  gender: fc.constantFrom('MALE', 'FEMALE'),
  dateOfBirth: fc.date({ min: new Date('2010-01-01'), max: new Date('2020-12-31') }),
  placeOfBirth: fc.string({ minLength: 2, maxLength: 50 }),
  address: fc.string({ minLength: 10, maxLength: 200 }),
  phone: fc.option(fc.string({ minLength: 10, maxLength: 15 })),
  photo: fc.option(fc.webUrl()),
  parentId: fc.uuid(),
  enrollmentDate: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  isActive: fc.boolean()
})

// Teacher arbitrary
const teacherArbitrary = fc.record({
  nip: fc.string({ minLength: 10, maxLength: 20 }),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  email: fc.emailAddress(),
  phone: fc.string({ minLength: 10, maxLength: 15 }),
  address: fc.string({ minLength: 10, maxLength: 200 }),
  dateOfBirth: fc.date({ min: new Date('1970-01-01'), max: new Date('2000-12-31') }),
  gender: fc.constantFrom('MALE', 'FEMALE'),
  joinDate: fc.date({ min: new Date('2010-01-01'), max: new Date() }),
  subjects: fc.array(fc.constantFrom('Matematika', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris'), { minLength: 1, maxLength: 5 })
})

// Class arbitrary
const classArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 10 }),
  grade: fc.integer({ min: 1, max: 6 }),
  teacherId: fc.uuid(),
  academicYearId: fc.uuid(),
  capacity: fc.integer({ min: 20, max: 40 })
})

// Invoice arbitrary
const invoiceArbitrary = fc.record({
  invoiceNo: fc.string({ minLength: 10, maxLength: 20 }),
  studentId: fc.uuid(),
  academicYearId: fc.uuid(),
  month: fc.integer({ min: 1, max: 12 }),
  year: fc.integer({ min: 2020, max: 2030 }),
  amount: fc.float({ min: 100000, max: 500000 }),
  status: fc.constantFrom('PENDING', 'PAID', 'OVERDUE', 'CANCELLED'),
  dueDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
})
```

### Integration Testing

**Database Setup**:
- Use a separate test database
- Reset database state before each test suite
- Use transactions for test isolation

**Example Integration Test**:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createStudent, getStudents, updateStudent, deleteStudent } from './actions'

describe('Student CRUD Integration', () => {
  let testParentId: string
  
  beforeAll(async () => {
    // Setup: Create test parent
    const parent = await prisma.parent.create({
      data: {
        user: {
          create: {
            email: 'test@example.com',
            password: 'hashed',
            name: 'Test Parent',
            role: 'PARENT'
          }
        },
        fatherName: 'Test Father',
        motherName: 'Test Mother',
        phone: '08123456789',
        address: 'Test Address'
      }
    })
    testParentId = parent.id
  })
  
  afterAll(async () => {
    // Cleanup
    await prisma.student.deleteMany()
    await prisma.parent.deleteMany()
    await prisma.user.deleteMany()
  })
  
  it('should complete full CRUD lifecycle', async () => {
    // Create
    const createResult = await createStudent({
      nis: '2026999',
      name: 'Integration Test Student',
      gender: 'MALE',
      dateOfBirth: new Date('2015-01-01'),
      placeOfBirth: 'Jakarta',
      address: 'Test Address',
      parentId: testParentId,
      enrollmentDate: new Date()
    })
    
    expect(createResult.success).toBe(true)
    const studentId = createResult.data!.id
    
    // Read
    const students = await getStudents({})
    expect(students.students).toHaveLength(1)
    expect(students.students[0].id).toBe(studentId)
    
    // Update
    const updateResult = await updateStudent(studentId, {
      name: 'Updated Name'
    })
    expect(updateResult.success).toBe(true)
    
    const updatedStudent = await prisma.student.findUnique({
      where: { id: studentId }
    })
    expect(updatedStudent?.name).toBe('Updated Name')
    
    // Delete
    const deleteResult = await deleteStudent(studentId)
    expect(deleteResult.success).toBe(true)
    
    const deletedStudent = await prisma.student.findUnique({
      where: { id: studentId }
    })
    expect(deletedStudent?.deletedAt).not.toBeNull()
  })
})
```

### Test Coverage Goals

- Unit test coverage: 80% minimum
- Property test coverage: All 31 properties implemented
- Integration test coverage: All critical user flows
- E2E test coverage: Key user journeys (optional, not part of this spec)
