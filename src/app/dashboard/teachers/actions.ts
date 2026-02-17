'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'
import bcrypt from 'bcryptjs'

export interface TeacherWithRelations {
  id: string
  userId: string
  nip: string
  phone: string
  address: string
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE'
  joinDate: Date
  subjects: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  user: {
    id: string
    name: string
    email: string
  }
  classes: Array<{
    id: string
    name: string
    grade: number
  }>
}

/**
 * Get teachers with search
 */
export async function getTeachers(params: { search?: string } = {}) {
  const { search = '' } = params

  try {
    const where: any = {
      deletedAt: null,
    }

    // Search filter (name, NIP, or email)
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { nip: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    })

    return teachers as TeacherWithRelations[]
  } catch (error) {
    console.error('Failed to fetch teachers:', error)
    throw new Error('Failed to fetch teachers')
  }
}

/**
 * Get a single teacher by ID
 */
export async function getTeacherById(id: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
    })

    return teacher as TeacherWithRelations | null
  } catch (error) {
    console.error('Failed to fetch teacher:', error)
    return null
  }
}

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Create a new teacher with user account
 */
export async function createTeacher(formData: FormData): Promise<ActionResult<TeacherWithRelations>> {
  try {
    // Extract and validate data
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const nip = formData.get('nip') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const gender = formData.get('gender') as 'MALE' | 'FEMALE'
    const joinDate = formData.get('joinDate') as string
    const subjectsStr = formData.get('subjects') as string
    const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : []

    // Check for duplicate NIP
    const existingTeacherByNip = await prisma.teacher.findUnique({
      where: { nip },
    })

    if (existingTeacherByNip) {
      return {
        success: false,
        error: 'NIP already exists',
      }
    }

    // Check for duplicate email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail) {
      return {
        success: false,
        error: 'Email already exists',
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and teacher in transaction
    const teacher = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'TEACHER',
        },
      })

      // Create teacher
      const newTeacher = await tx.teacher.create({
        data: {
          userId: user.id,
          nip,
          phone,
          address,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          joinDate: new Date(joinDate),
          subjects: JSON.stringify(subjects),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          classes: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
        },
      })

      // Log activity
      await logActivity({
        userId: user.id,
        action: 'CREATE',
        entity: 'Teacher',
        entityId: newTeacher.id,
        details: `Created teacher: ${name}`,
      })

      return newTeacher
    })

    revalidatePath('/dashboard/teachers')

    return {
      success: true,
      data: teacher as TeacherWithRelations,
    }
  } catch (error) {
    console.error('Failed to create teacher:', error)
    return {
      success: false,
      error: 'Failed to create teacher',
    }
  }
}

/**
 * Update an existing teacher
 */
export async function updateTeacher(
  id: string,
  formData: FormData
): Promise<ActionResult<TeacherWithRelations>> {
  try {
    // Extract data
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const nip = formData.get('nip') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const gender = formData.get('gender') as 'MALE' | 'FEMALE'
    const joinDate = formData.get('joinDate') as string
    const subjectsStr = formData.get('subjects') as string
    const subjects = subjectsStr ? subjectsStr.split(',').map(s => s.trim()) : []

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!existingTeacher) {
      return {
        success: false,
        error: 'Teacher not found',
      }
    }

    // Check for duplicate NIP (excluding current teacher)
    const duplicateNip = await prisma.teacher.findFirst({
      where: {
        nip,
        id: { not: id },
      },
    })

    if (duplicateNip) {
      return {
        success: false,
        error: 'NIP already exists',
      }
    }

    // Check for duplicate email (excluding current user)
    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: existingTeacher.userId },
      },
    })

    if (duplicateEmail) {
      return {
        success: false,
        error: 'Email already exists',
      }
    }

    // Update user and teacher in transaction
    const teacher = await prisma.$transaction(async (tx) => {
      // Update user
      await tx.user.update({
        where: { id: existingTeacher.userId },
        data: {
          name,
          email,
        },
      })

      // Update teacher
      const updatedTeacher = await tx.teacher.update({
        where: { id },
        data: {
          nip,
          phone,
          address,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          joinDate: new Date(joinDate),
          subjects: JSON.stringify(subjects),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          classes: {
            select: {
              id: true,
              name: true,
              grade: true,
            },
          },
        },
      })

      // Log activity
      await logActivity({
        userId: existingTeacher.userId,
        action: 'UPDATE',
        entity: 'Teacher',
        entityId: id,
        details: `Updated teacher: ${name}`,
      })

      return updatedTeacher
    })

    revalidatePath('/dashboard/teachers')

    return {
      success: true,
      data: teacher as TeacherWithRelations,
    }
  } catch (error) {
    console.error('Failed to update teacher:', error)
    return {
      success: false,
      error: 'Failed to update teacher',
    }
  }
}

/**
 * Delete a teacher (soft delete)
 */
export async function deleteTeacher(id: string): Promise<ActionResult<void>> {
  try {
    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        classes: {
          where: {
            deletedAt: null,
          },
        },
      },
    })

    if (!teacher) {
      return {
        success: false,
        error: 'Teacher not found',
      }
    }

    // Check if teacher has active classes
    if (teacher.classes.length > 0) {
      return {
        success: false,
        error: 'Cannot delete teacher with active classes',
      }
    }

    // Soft delete teacher and user
    await prisma.$transaction(async (tx) => {
      await tx.teacher.update({
        where: { id },
        data: { deletedAt: new Date() },
      })

      await tx.user.update({
        where: { id: teacher.userId },
        data: { deletedAt: new Date() },
      })

      // Log activity
      await logActivity({
        userId: teacher.userId,
        action: 'DELETE',
        entity: 'Teacher',
        entityId: id,
        details: `Deleted teacher: ${teacher.user.name}`,
      })
    })

    revalidatePath('/dashboard/teachers')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete teacher:', error)
    return {
      success: false,
      error: 'Failed to delete teacher',
    }
  }
}

/**
 * Update teacher subjects
 */
export async function updateTeacherSubjects(
  id: string,
  subjects: string[]
): Promise<ActionResult<TeacherWithRelations>> {
  try {
    const teacher = await prisma.teacher.update({
      where: { id },
      data: { subjects: JSON.stringify(subjects) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classes: {
          select: {
            id: true,
            name: true,
            grade: true,
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: teacher.userId,
      action: 'UPDATE',
      entity: 'Teacher',
      entityId: id,
      details: `Updated subjects for teacher: ${teacher.user.name}`,
    })

    revalidatePath('/dashboard/teachers')

    return {
      success: true,
      data: teacher as TeacherWithRelations,
    }
  } catch (error) {
    console.error('Failed to update teacher subjects:', error)
    return {
      success: false,
      error: 'Failed to update teacher subjects',
    }
  }
}
