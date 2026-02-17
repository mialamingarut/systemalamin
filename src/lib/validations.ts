import { z } from 'zod'

// Phone number validation regex
export const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/

// Student validation schema
export const studentSchema = z.object({
  nis: z.string().min(5, 'NIS must be at least 5 characters'),
  nisn: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Gender is required' }),
  dateOfBirth: z.coerce.date({ required_error: 'Date of birth is required' }),
  placeOfBirth: z.string().min(2, 'Place of birth must be at least 2 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format').optional().or(z.literal('')),
  photo: z.string().url().optional().or(z.literal('')),
  parentId: z.string().cuid('Invalid parent ID'),
  enrollmentDate: z.coerce.date({ required_error: 'Enrollment date is required' }),
})

export type StudentFormData = z.infer<typeof studentSchema>

// Teacher validation schema
export const teacherSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  nip: z.string().min(10, 'NIP must be at least 10 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  dateOfBirth: z.coerce.date({ required_error: 'Date of birth is required' }),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: 'Gender is required' }),
  joinDate: z.coerce.date({ required_error: 'Join date is required' }),
  subjects: z.array(z.string()).default([]),
})

export type TeacherFormData = z.infer<typeof teacherSchema>

// Class validation schema
export const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  grade: z.coerce.number().int().min(1, 'Grade must be between 1 and 6').max(6, 'Grade must be between 1 and 6'),
  teacherId: z.string().cuid('Invalid teacher ID'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(50, 'Capacity cannot exceed 50'),
})

export type ClassFormData = z.infer<typeof classSchema>

// Payment validation schema
export const paymentSchema = z.object({
  paidAmount: z.coerce.number().positive('Payment amount must be positive'),
  paidAt: z.coerce.date({ required_error: 'Payment date is required' }),
  notes: z.string().optional(),
})

export type PaymentData = z.infer<typeof paymentSchema>

// SPMB score validation schema
export const scoreSchema = z.object({
  testScore: z.coerce.number().min(0, 'Score must be between 0 and 100').max(100, 'Score must be between 0 and 100'),
})

export type ScoreData = z.infer<typeof scoreSchema>

// Invoice generation validation schema
export const invoiceGenerationSchema = z.object({
  month: z.coerce.number().int().min(1, 'Month must be between 1 and 12').max(12, 'Month must be between 1 and 12'),
  year: z.coerce.number().int().min(2020, 'Year must be 2020 or later').max(2100, 'Year must be 2100 or earlier'),
})

export type InvoiceGenerationData = z.infer<typeof invoiceGenerationSchema>

// Academic year validation schema
export const academicYearSchema = z.object({
  name: z.string().min(4, 'Academic year name must be at least 4 characters'),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date({ required_error: 'End date is required' }),
}).refine((data) => data.startDate < data.endDate, {
  message: 'Start date must be before end date',
  path: ['endDate'],
})

export type AcademicYearFormData = z.infer<typeof academicYearSchema>

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'PARENT'], { required_error: 'Role is required' }),
})

export type UserFormData = z.infer<typeof userSchema>

// Announcement validation schema
export const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  isPinned: z.boolean().default(false),
  academicYearId: z.string().cuid().optional(),
})

export type AnnouncementFormData = z.infer<typeof announcementSchema>

// Activity validation schema
export const activitySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.coerce.date({ required_error: 'Date is required' }),
  location: z.string().optional(),
  photos: z.array(z.string().url()).default([]),
})

export type ActivityFormData = z.infer<typeof activitySchema>

// Calendar event validation schema
export const calendarEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.coerce.date({ required_error: 'Date is required' }),
  description: z.string().min(5, 'Description must be at least 5 characters'),
})

export type CalendarEventFormData = z.infer<typeof calendarEventSchema>

// System config validation schema
export const systemConfigSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
})

export type SystemConfigFormData = z.infer<typeof systemConfigSchema>

// Helper function to validate phone number
export function validatePhoneNumber(phone: string): boolean {
  return phoneRegex.test(phone)
}

// Helper function to format phone number for display
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as +62 XXX-XXXX-XXXX
  if (cleaned.startsWith('62')) {
    const withoutPrefix = cleaned.substring(2)
    return `+62 ${withoutPrefix.substring(0, 3)}-${withoutPrefix.substring(3, 7)}-${withoutPrefix.substring(7)}`
  } else if (cleaned.startsWith('0')) {
    const withoutZero = cleaned.substring(1)
    return `+62 ${withoutZero.substring(0, 3)}-${withoutZero.substring(3, 7)}-${withoutZero.substring(7)}`
  }
  
  return phone
}

// Phone number validation is handled by phoneRegex
// Email validation is handled by z.string().email()
