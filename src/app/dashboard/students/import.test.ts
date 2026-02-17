import { describe, it, expect, beforeEach, vi } from 'vitest'
import { importStudents, ImportResult } from './actions'
import * as XLSX from 'xlsx'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
      createMany: vi.fn(),
    },
    parent: {
      findUnique: vi.fn(),
    },
  },
}))

// Mock activity log
vi.mock('@/lib/activity-log', () => ({
  logActivity: vi.fn(),
}))

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Student Import Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('File Format Validation', () => {
    it('should reject empty Excel file', async () => {
      // Create empty workbook
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet([])
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[] as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('empty')
    })

    it('should reject file with missing required columns', async () => {
      // Create workbook with incomplete columns
      const data = [
        {
          'NIS': '2026001',
          'Name': 'Test Student',
          // Missing other required columns
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(false)
      expect(result.errors[0].message).toContain('Missing required columns')
    })
  })

  describe('Row Validation', () => {
    it('should validate required fields', async () => {
      const data = [
        {
          'NIS': '', // Empty required field
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'MALE',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address',
          'Phone': '',
          'Photo': '',
          'Parent ID': 'parent-id',
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should validate gender values', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: 'parent-id',
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'INVALID', // Invalid gender
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': 'parent-id',
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(false)
      expect(result.errors.some(e => e.field === 'Gender')).toBe(true)
    })

    it('should validate date formats', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: 'parent-id',
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'MALE',
          'Date of Birth': 'invalid-date', // Invalid date
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': 'parent-id',
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(false)
      expect(result.errors.some(e => e.field === 'Date of Birth')).toBe(true)
    })
  })

  describe('Duplicate Handling', () => {
    it('should detect duplicate NIS in database', async () => {
      const { prisma } = await import('@/lib/prisma')
      
      const parentId = 'clxyz1234567890abcdefghij' // Valid CUID format
      
      // Mock existing student with same NIS
      vi.mocked(prisma.student.findUnique).mockResolvedValue({
        id: 'existing-id',
        nis: '2026001',
        nisn: null,
        name: 'Existing Student',
        gender: 'MALE',
        dateOfBirth: new Date('2015-01-15'),
        placeOfBirth: 'Jakarta',
        address: 'Address',
        phone: null,
        photo: null,
        parentId: parentId,
        enrollmentDate: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: parentId,
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'MALE',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)
      
      expect(result.success).toBe(false)
      expect(result.errors.some(e => e.field === 'NIS' && e.message.includes('already exists'))).toBe(true)
      expect(result.skipped).toBe(1)
    })

    it('should detect duplicate NIS within import file', async () => {
      const { prisma } = await import('@/lib/prisma')
      
      const parentId = 'clxyz1234567890abcdefghij' // Valid CUID format
      
      vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: parentId,
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
      // Mock createMany for the first valid row
      vi.mocked(prisma.student.createMany).mockResolvedValue({ count: 1 })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student 1',
          'Gender': 'MALE',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
        {
          'NIS': '2026001', // Duplicate NIS
          'NISN': '',
          'Name': 'Test Student 2',
          'Gender': 'FEMALE',
          'Date of Birth': '2015-02-20',
          'Place of Birth': 'Bandung',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.errors.some(e => e.message.includes('Duplicate NIS'))).toBe(true)
      expect(result.imported).toBe(1) // First row should be imported
      expect(result.skipped).toBe(1) // Second row should be skipped
    })
  })

  describe('Successful Import', () => {
    it('should import valid students', async () => {
      const { prisma } = await import('@/lib/prisma')
      
      const parentId = 'clxyz1234567890abcdefghij' // Valid CUID format
      
      vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: parentId,
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
      vi.mocked(prisma.student.createMany).mockResolvedValue({ count: 2 })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student 1',
          'Gender': 'MALE',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
        {
          'NIS': '2026002',
          'NISN': '',
          'Name': 'Test Student 2',
          'Gender': 'FEMALE',
          'Date of Birth': '2015-02-20',
          'Place of Birth': 'Bandung',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.success).toBe(true)
      expect(result.imported).toBe(2)
      expect(result.skipped).toBe(0)
      expect(prisma.student.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ nis: '2026001', isActive: true }),
          expect.objectContaining({ nis: '2026002', isActive: true }),
        ]),
      })
    })

    it('should generate import summary', async () => {
      const { prisma } = await import('@/lib/prisma')
      
      const parentId = 'clxyz1234567890abcdefghij' // Valid CUID format
      
      vi.mocked(prisma.student.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: parentId,
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })
      vi.mocked(prisma.student.createMany).mockResolvedValue({ count: 1 })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'MALE',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': parentId,
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.summary).toContain('Processed')
      expect(result.summary).toContain('imported')
      expect(result.summary).toContain('skipped')
    })
  })

  describe('Error Reporting', () => {
    it('should include row numbers in error reports', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: 'parent-id',
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'INVALID', // Error in row 2 (1-indexed + header)
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': 'parent-id',
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.errors[0].row).toBe(2) // Row 2 in Excel (1-indexed + header)
    })

    it('should include field names in error reports', async () => {
      const { prisma } = await import('@/lib/prisma')
      vi.mocked(prisma.parent.findUnique).mockResolvedValue({
        id: 'parent-id',
        userId: 'user-id',
        fatherName: 'Father',
        motherName: 'Mother',
        phone: '08123456789',
        address: 'Address',
        occupation: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      })

      const data = [
        {
          'NIS': '2026001',
          'NISN': '',
          'Name': 'Test Student',
          'Gender': 'INVALID',
          'Date of Birth': '2015-01-15',
          'Place of Birth': 'Jakarta',
          'Address': 'Test Address Long Enough',
          'Phone': '',
          'Photo': '',
          'Parent ID': 'parent-id',
          'Enrollment Date': '2026-07-01',
        },
      ]
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      const bufferArray = Array.from(buffer) as number[]

      const result = await importStudents(bufferArray)

      expect(result.errors[0].field).toBe('Gender')
    })
  })
})
