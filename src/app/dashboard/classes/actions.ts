'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export interface ClassWithRelations {
  id: string
  name: string
  grade: number
  academicYearId: string
  teacherId: string
  capacity: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  academicYear: {
    id: string
    name: string
    isActive: boolean
  }
  teacher: {
    id: string
    nip: string
    user: {
      id: string
      name: string
    }
  }
  students: Array<{
    id: string
    studentId: string
    student: {
      id: string
      nis: string
      name: string
    }
  }>
  _count: {
    students: number
  }
}

/**
 * Get classes with filtering
 */
export async function getClasses(params: { grade?: number } = {}) {
  const { grade } = params

  try {
    const where: any = {
      deletedAt: null,
    }

    if (grade) {
      where.grade = grade
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
            studentId: true,
            student: {
              select: {
                id: true,
                nis: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    })

    return classes as ClassWithRelations[]
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    throw new Error('Failed to fetch classes')
  }
}

/**
 * Get a single class by ID
 */
export async function getClassById(id: string) {
  try {
    const classData = await prisma.class.findUnique({
      where: { id, deletedAt: null },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
            studentId: true,
            student: {
              select: {
                id: true,
                nis: true,
                name: true,
                gender: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    return classData as ClassWithRelations | null
  } catch (error) {
    console.error('Failed to fetch class:', error)
    return null
  }
}

/**
 * Get all teachers for dropdown
 */
export async function getTeachersForDropdown() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        nip: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    })

    return teachers
  } catch (error) {
    console.error('Failed to fetch teachers:', error)
    return []
  }
}

/**
 * Get active academic year
 */
export async function getActiveAcademicYear() {
  try {
    const academicYear = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
        deletedAt: null,
      },
    })

    return academicYear
  } catch (error) {
    console.error('Failed to fetch active academic year:', error)
    return null
  }
}

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Create a new class
 */
export async function createClass(formData: FormData): Promise<ActionResult<ClassWithRelations>> {
  try {
    const name = formData.get('name') as string
    const grade = parseInt(formData.get('grade') as string)
    const teacherId = formData.get('teacherId') as string
    const capacity = parseInt(formData.get('capacity') as string)

    // Get active academic year
    const activeYear = await getActiveAcademicYear()
    if (!activeYear) {
      return {
        success: false,
        error: 'No active academic year found',
      }
    }

    // Check for duplicate class name within academic year
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        academicYearId: activeYear.id,
        deletedAt: null,
      },
    })

    if (existingClass) {
      return {
        success: false,
        error: 'Class name already exists in this academic year',
      }
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        teacherId,
        capacity,
        academicYearId: activeYear.id,
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
            studentId: true,
            student: {
              select: {
                id: true,
                nis: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'CREATE',
      entity: 'Class',
      entityId: newClass.id,
      details: `Created class: ${name}`,
    })

    revalidatePath('/dashboard/classes')

    return {
      success: true,
      data: newClass as ClassWithRelations,
    }
  } catch (error) {
    console.error('Failed to create class:', error)
    return {
      success: false,
      error: 'Failed to create class',
    }
  }
}

/**
 * Update an existing class
 */
export async function updateClass(
  id: string,
  formData: FormData
): Promise<ActionResult<ClassWithRelations>> {
  try {
    const name = formData.get('name') as string
    const grade = parseInt(formData.get('grade') as string)
    const teacherId = formData.get('teacherId') as string
    const capacity = parseInt(formData.get('capacity') as string)

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id, deletedAt: null },
    })

    if (!existingClass) {
      return {
        success: false,
        error: 'Class not found',
      }
    }

    // Check for duplicate class name within academic year (excluding current class)
    const duplicateClass = await prisma.class.findFirst({
      where: {
        name,
        academicYearId: existingClass.academicYearId,
        id: { not: id },
        deletedAt: null,
      },
    })

    if (duplicateClass) {
      return {
        success: false,
        error: 'Class name already exists in this academic year',
      }
    }

    // Update class
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade,
        teacherId,
        capacity,
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
            studentId: true,
            student: {
              select: {
                id: true,
                nis: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'Class',
      entityId: id,
      details: `Updated class: ${name}`,
    })

    revalidatePath('/dashboard/classes')

    return {
      success: true,
      data: updatedClass as ClassWithRelations,
    }
  } catch (error) {
    console.error('Failed to update class:', error)
    return {
      success: false,
      error: 'Failed to update class',
    }
  }
}

/**
 * Delete a class (soft delete)
 */
export async function deleteClass(id: string): Promise<ActionResult<void>> {
  try {
    // Check if class exists
    const classData = await prisma.class.findUnique({
      where: { id, deletedAt: null },
      include: {
        students: true,
      },
    })

    if (!classData) {
      return {
        success: false,
        error: 'Class not found',
      }
    }

    // Check if class has assigned students
    if (classData.students.length > 0) {
      return {
        success: false,
        error: 'Cannot delete class with assigned students',
      }
    }

    // Soft delete
    await prisma.class.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'DELETE',
      entity: 'Class',
      entityId: id,
      details: `Deleted class: ${classData.name}`,
    })

    revalidatePath('/dashboard/classes')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete class:', error)
    return {
      success: false,
      error: 'Failed to delete class',
    }
  }
}

/**
 * Get available students for class roster (not in any class for this academic year)
 */
export async function getAvailableStudents(academicYearId: string, currentClassId?: string) {
  try {
    // Get all students who are not in any class for this academic year
    // OR are in the current class (for editing)
    const students = await prisma.student.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        OR: [
          {
            classStudents: {
              none: {
                class: {
                  academicYearId,
                  deletedAt: null,
                },
              },
            },
          },
          ...(currentClassId
            ? [
                {
                  classStudents: {
                    some: {
                      classId: currentClassId,
                    },
                  },
                },
              ]
            : []),
        ],
      },
      select: {
        id: true,
        nis: true,
        name: true,
        gender: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return students
  } catch (error) {
    console.error('Failed to fetch available students:', error)
    return []
  }
}

/**
 * Update class roster (add/remove students)
 */
export async function updateClassRoster(
  classId: string,
  studentIds: string[]
): Promise<ActionResult<void>> {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId, deletedAt: null },
      include: {
        students: true,
        academicYear: true,
      },
    })

    if (!classData) {
      return {
        success: false,
        error: 'Class not found',
      }
    }

    // Check capacity
    if (studentIds.length > classData.capacity) {
      return {
        success: false,
        error: `Cannot add more than ${classData.capacity} students to this class`,
      }
    }

    // Check if any student is already in another class for this academic year
    const studentsInOtherClasses = await prisma.classStudent.findMany({
      where: {
        studentId: { in: studentIds },
        classId: { not: classId },
        class: {
          academicYearId: classData.academicYearId,
          deletedAt: null,
        },
      },
      include: {
        student: true,
        class: true,
      },
    })

    if (studentsInOtherClasses.length > 0) {
      const studentNames = studentsInOtherClasses
        .map((cs) => `${cs.student.name} (already in ${cs.class.name})`)
        .join(', ')
      return {
        success: false,
        error: `Some students are already in other classes: ${studentNames}`,
      }
    }

    // Update roster in transaction
    await prisma.$transaction(async (tx) => {
      // Remove all current students
      await tx.classStudent.deleteMany({
        where: { classId },
      })

      // Add new students
      if (studentIds.length > 0) {
        await tx.classStudent.createMany({
          data: studentIds.map((studentId) => ({
            classId,
            studentId,
          })),
        })
      }
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'Class',
      entityId: classId,
      details: `Updated roster for class: ${classData.name} (${studentIds.length} students)`,
    })

    revalidatePath('/dashboard/classes')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update class roster:', error)
    return {
      success: false,
      error: 'Failed to update class roster',
    }
  }
}
