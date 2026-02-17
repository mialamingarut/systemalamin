import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getStudents, getClasses } from './actions'
import { prisma } from '@/lib/prisma'

describe('Student Actions', () => {
  describe('getStudents', () => {
    it('should fetch students with default pagination', async () => {
      const result = await getStudents()

      expect(result).toHaveProperty('students')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
      expect(result).toHaveProperty('totalPages')
      expect(result.pageSize).toBe(20)
      expect(result.page).toBe(1)
      expect(Array.isArray(result.students)).toBe(true)
    })

    it('should filter students by search term', async () => {
      const result = await getStudents({ search: 'Rizki' })

      expect(result.students.length).toBeGreaterThan(0)
      result.students.forEach((student) => {
        const matchesName = student.name.toLowerCase().includes('rizki')
        const matchesNIS = student.nis.toLowerCase().includes('rizki')
        const matchesParent = student.parent.user.name.toLowerCase().includes('rizki')
        expect(matchesName || matchesNIS || matchesParent).toBe(true)
      })
    })

    it('should filter students by status', async () => {
      const result = await getStudents({ status: 'active' })

      result.students.forEach((student) => {
        expect(student.isActive).toBe(true)
      })
    })

    it('should return empty array when no students match search', async () => {
      const result = await getStudents({ search: 'NonExistentStudent12345' })

      expect(result.students).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('should include parent and class information', async () => {
      const result = await getStudents()

      if (result.students.length > 0) {
        const student = result.students[0]
        expect(student).toHaveProperty('parent')
        expect(student.parent).toHaveProperty('user')
        expect(student.parent.user).toHaveProperty('name')
        expect(student).toHaveProperty('classStudents')
        expect(Array.isArray(student.classStudents)).toBe(true)
      }
    })

    it('should paginate results correctly', async () => {
      const page1 = await getStudents({ page: 1 })
      const page2 = await getStudents({ page: 2 })

      expect(page1.page).toBe(1)
      expect(page2.page).toBe(2)
      
      // If there are more than 20 students, page 2 should have different students
      if (page1.total > 20) {
        expect(page1.students[0].id).not.toBe(page2.students[0].id)
      }
    })
  })

  describe('getClasses', () => {
    it('should fetch all classes', async () => {
      const classes = await getClasses()

      expect(Array.isArray(classes)).toBe(true)
      classes.forEach((cls) => {
        expect(cls).toHaveProperty('id')
        expect(cls).toHaveProperty('name')
        expect(cls).toHaveProperty('grade')
      })
    })

    it('should order classes by grade and name', async () => {
      const classes = await getClasses()

      if (classes.length > 1) {
        for (let i = 0; i < classes.length - 1; i++) {
          const current = classes[i]
          const next = classes[i + 1]
          
          // Either grade is less, or grade is equal and name is less/equal
          const isOrdered =
            current.grade < next.grade ||
            (current.grade === next.grade && current.name <= next.name)
          
          expect(isOrdered).toBe(true)
        }
      }
    })

    it('should not include deleted classes', async () => {
      const classes = await getClasses()

      // Verify by checking database directly
      const classIds = classes.map((c) => c.id)
      const dbClasses = await prisma.class.findMany({
        where: { id: { in: classIds } },
      })

      dbClasses.forEach((cls) => {
        expect(cls.deletedAt).toBeNull()
      })
    })
  })
})
