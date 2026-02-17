import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { updateStudent, deleteStudent, getStudentById } from './actions'
import { prisma } from '@/lib/prisma'

describe('Student Update and Delete Operations', () => {
  let testStudentId: string
  let testParentId: string

  beforeEach(async () => {
    // Create a test parent
    const parent = await prisma.parent.create({
      data: {
        user: {
          create: {
            email: `test-${Date.now()}@example.com`,
            password: 'hashedpassword',
            name: 'Test Parent',
            role: 'PARENT',
          },
        },
        fatherName: 'Test Father',
        motherName: 'Test Mother',
        phone: '08123456789',
        address: 'Test Address',
      },
    })
    testParentId = parent.id

    // Create a test student
    const student = await prisma.student.create({
      data: {
        nis: `TEST${Date.now()}`,
        name: 'Test Student',
        gender: 'MALE',
        dateOfBirth: new Date('2015-01-01'),
        placeOfBirth: 'Jakarta',
        address: 'Test Address',
        parentId: testParentId,
        enrollmentDate: new Date(),
      },
    })
    testStudentId = student.id
  })

  afterEach(async () => {
    // Clean up
    await prisma.student.deleteMany({
      where: { id: testStudentId },
    })
    await prisma.parent.deleteMany({
      where: { id: testParentId },
    })
    await prisma.user.deleteMany({
      where: { email: { contains: 'test-' } },
    })
  })

  describe('updateStudent', () => {
    it('should update student with valid data', async () => {
      const formData = new FormData()
      formData.set('nis', `UPDATED${Date.now()}`)
      formData.set('name', 'Updated Student Name')
      formData.set('gender', 'MALE')
      formData.set('dateOfBirth', '2015-01-01')
      formData.set('placeOfBirth', 'Jakarta')
      formData.set('address', 'Updated Address')
      formData.set('parentId', testParentId)
      formData.set('enrollmentDate', new Date().toISOString())

      const result = await updateStudent(testStudentId, formData)

      expect(result.success).toBe(true)
      expect(result.data?.name).toBe('Updated Student Name')
      expect(result.data?.address).toBe('Updated Address')
    })

    it('should reject duplicate NIS when updating', async () => {
      // Create another student
      const anotherStudent = await prisma.student.create({
        data: {
          nis: `ANOTHER${Date.now()}`,
          name: 'Another Student',
          gender: 'FEMALE',
          dateOfBirth: new Date('2015-01-01'),
          placeOfBirth: 'Jakarta',
          address: 'Test Address',
          parentId: testParentId,
          enrollmentDate: new Date(),
        },
      })

      const formData = new FormData()
      formData.set('nis', anotherStudent.nis) // Try to use another student's NIS
      formData.set('name', 'Test Student')
      formData.set('gender', 'MALE')
      formData.set('dateOfBirth', '2015-01-01')
      formData.set('placeOfBirth', 'Jakarta')
      formData.set('address', 'Test Address')
      formData.set('parentId', testParentId)
      formData.set('enrollmentDate', new Date().toISOString())

      const result = await updateStudent(testStudentId, formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('NIS already exists')

      // Clean up
      await prisma.student.delete({ where: { id: anotherStudent.id } })
    })

    it('should return error for non-existent student', async () => {
      const formData = new FormData()
      formData.set('nis', 'TEST123')
      formData.set('name', 'Test')
      formData.set('gender', 'MALE')
      formData.set('dateOfBirth', '2015-01-01')
      formData.set('placeOfBirth', 'Jakarta')
      formData.set('address', 'Test Address')
      formData.set('parentId', testParentId)
      formData.set('enrollmentDate', new Date().toISOString())

      const result = await updateStudent('non-existent-id', formData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Student not found')
    })
  })

  describe('deleteStudent', () => {
    it('should soft delete student without unpaid invoices', async () => {
      const result = await deleteStudent(testStudentId)

      expect(result.success).toBe(true)

      // Verify soft delete
      const deletedStudent = await prisma.student.findUnique({
        where: { id: testStudentId },
      })

      expect(deletedStudent?.deletedAt).not.toBeNull()
      expect(deletedStudent?.isActive).toBe(false)
    })

    it('should prevent deletion of student with unpaid invoices', async () => {
      // Create an academic year
      const academicYear = await prisma.academicYear.create({
        data: {
          name: `Test Year ${Date.now()}`,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true,
        },
      })

      // Create an unpaid invoice
      await prisma.invoice.create({
        data: {
          invoiceNo: `INV-TEST-${Date.now()}`,
          studentId: testStudentId,
          academicYearId: academicYear.id,
          month: 1,
          year: 2024,
          amount: 500000,
          status: 'PENDING',
          dueDate: new Date('2024-01-10'),
        },
      })

      const result = await deleteStudent(testStudentId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Cannot delete student with unpaid invoices')

      // Clean up
      await prisma.invoice.deleteMany({
        where: { studentId: testStudentId },
      })
      await prisma.academicYear.delete({
        where: { id: academicYear.id },
      })
    })

    it('should return error for non-existent student', async () => {
      const result = await deleteStudent('non-existent-id')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Student not found')
    })
  })

  describe('getStudentById', () => {
    it('should fetch student by ID with relations', async () => {
      const student = await getStudentById(testStudentId)

      expect(student).not.toBeNull()
      expect(student?.id).toBe(testStudentId)
      expect(student?.parent).toBeDefined()
      expect(student?.parent.user).toBeDefined()
    })

    it('should return null for non-existent student', async () => {
      const student = await getStudentById('non-existent-id')

      expect(student).toBeNull()
    })

    it('should not return deleted students', async () => {
      // Soft delete the student
      await prisma.student.update({
        where: { id: testStudentId },
        data: { deletedAt: new Date() },
      })

      const student = await getStudentById(testStudentId)

      expect(student).toBeNull()
    })
  })
})
