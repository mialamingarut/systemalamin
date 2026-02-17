import { describe, it, expect } from 'vitest'
import {
  studentSchema,
  teacherSchema,
  classSchema,
  paymentSchema,
  scoreSchema,
  academicYearSchema,
} from './validations'

describe('Validation Schemas', () => {
  describe('studentSchema', () => {
    it('should validate valid student data', () => {
      const validData = {
        nis: '2026001',
        name: 'John Doe',
        gender: 'MALE',
        dateOfBirth: new Date('2015-01-01'),
        placeOfBirth: 'Jakarta',
        address: '123 Main Street, Jakarta',
        parentId: 'clxyz1234567890abcdef',
        enrollmentDate: new Date('2024-01-01'),
      }

      const result = studentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject student with short NIS', () => {
      const invalidData = {
        nis: '123',
        name: 'John Doe',
        gender: 'MALE',
        dateOfBirth: new Date('2015-01-01'),
        placeOfBirth: 'Jakarta',
        address: '123 Main Street, Jakarta',
        parentId: 'clxyz1234567890abcdef',
        enrollmentDate: new Date('2024-01-01'),
      }

      const result = studentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('NIS must be at least 5 characters')
      }
    })

    it('should reject student with invalid gender', () => {
      const invalidData = {
        nis: '2026001',
        name: 'John Doe',
        gender: 'INVALID',
        dateOfBirth: new Date('2015-01-01'),
        placeOfBirth: 'Jakarta',
        address: '123 Main Street, Jakarta',
        parentId: 'clxyz1234567890abcdef',
        enrollmentDate: new Date('2024-01-01'),
      }

      const result = studentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('teacherSchema', () => {
    it('should validate valid teacher data', () => {
      const validData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        nip: '1234567890',
        phone: '08123456789',
        address: '456 Teacher Street, Jakarta',
        dateOfBirth: new Date('1985-01-01'),
        gender: 'FEMALE',
        joinDate: new Date('2020-01-01'),
        subjects: ['Mathematics', 'Science'],
      }

      const result = teacherSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject teacher with invalid email', () => {
      const invalidData = {
        name: 'Jane Smith',
        email: 'invalid-email',
        password: 'password123',
        nip: '1234567890',
        phone: '08123456789',
        address: '456 Teacher Street, Jakarta',
        dateOfBirth: new Date('1985-01-01'),
        gender: 'FEMALE',
        joinDate: new Date('2020-01-01'),
        subjects: [],
      }

      const result = teacherSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format')
      }
    })
  })

  describe('classSchema', () => {
    it('should validate valid class data', () => {
      const validData = {
        name: 'Class 1A',
        grade: 1,
        teacherId: 'clxyz1234567890abcdef',
        capacity: 30,
      }

      const result = classSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject class with grade out of range', () => {
      const invalidData = {
        name: 'Class 7A',
        grade: 7,
        teacherId: 'clxyz1234567890abcdef',
        capacity: 30,
      }

      const result = classSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Grade must be between 1 and 6')
      }
    })
  })

  describe('scoreSchema', () => {
    it('should validate valid score', () => {
      const validData = { testScore: 85 }
      const result = scoreSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject score below 0', () => {
      const invalidData = { testScore: -5 }
      const result = scoreSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject score above 100', () => {
      const invalidData = { testScore: 105 }
      const result = scoreSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('academicYearSchema', () => {
    it('should validate valid academic year', () => {
      const validData = {
        name: '2024/2025',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2025-06-30'),
      }

      const result = academicYearSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject academic year with end date before start date', () => {
      const invalidData = {
        name: '2024/2025',
        startDate: new Date('2025-06-30'),
        endDate: new Date('2024-07-01'),
      }

      const result = academicYearSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Start date must be before end date')
      }
    })
  })

  describe('paymentSchema', () => {
    it('should validate valid payment data', () => {
      const validData = {
        paidAmount: 500000,
        paidAt: new Date('2024-01-15'),
        notes: 'Payment received',
      }

      const result = paymentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative payment amount', () => {
      const invalidData = {
        paidAmount: -100,
        paidAt: new Date('2024-01-15'),
      }

      const result = paymentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
