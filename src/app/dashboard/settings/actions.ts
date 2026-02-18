'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'
import bcrypt from 'bcryptjs'

export interface AcademicYearWithRelations {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface SystemConfigItem {
  id: string
  key: string
  value: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithRelations {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface ActivityLogWithRelations {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string | null
  details: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
  } | null
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ============ Academic Year Management ============

export async function getAcademicYears() {
  try {
    const years = await prisma.academicYear.findMany({
      where: { deletedAt: null },
      orderBy: { startDate: 'desc' },
    })

    return years as AcademicYearWithRelations[]
  } catch (error) {
    console.error('Failed to fetch academic years:', error)
    throw new Error('Failed to fetch academic years')
  }
}

export async function createAcademicYear(data: {
  name: string
  startDate: Date
  endDate: Date
  isActive?: boolean
}): Promise<ActionResult<AcademicYearWithRelations>> {
  try {
    // Validate date range
    if (data.startDate >= data.endDate) {
      return {
        success: false,
        error: 'Tanggal mulai harus sebelum tanggal selesai',
      }
    }

    // Check name uniqueness
    const existing = await prisma.academicYear.findFirst({
      where: {
        name: data.name,
        deletedAt: null,
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'Nama tahun ajaran sudah digunakan',
      }
    }

    // If setting as active, deactivate others
    if (data.isActive) {
      await prisma.academicYear.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })
    }

    const year = await prisma.academicYear.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive || false,
      },
    })

    await logActivity({
      userId: 'system',
      action: 'CREATE',
      entity: 'AcademicYear',
      entityId: year.id,
      details: `Created academic year: ${year.name}`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: year as AcademicYearWithRelations,
    }
  } catch (error) {
    console.error('Failed to create academic year:', error)
    return {
      success: false,
      error: 'Failed to create academic year',
    }
  }
}

export async function updateAcademicYear(
  id: string,
  data: {
    name?: string
    startDate?: Date
    endDate?: Date
    isActive?: boolean
  }
): Promise<ActionResult<void>> {
  try {
    const year = await prisma.academicYear.findUnique({
      where: { id, deletedAt: null },
    })

    if (!year) {
      return {
        success: false,
        error: 'Tahun ajaran tidak ditemukan',
      }
    }

    // Validate date range if both dates provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      return {
        success: false,
        error: 'Tanggal mulai harus sebelum tanggal selesai',
      }
    }

    // If setting as active, deactivate others
    if (data.isActive) {
      await prisma.academicYear.updateMany({
        where: { 
          isActive: true,
          id: { not: id },
        },
        data: { isActive: false },
      })
    }

    await prisma.academicYear.update({
      where: { id },
      data,
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'AcademicYear',
      entityId: id,
      details: `Updated academic year`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update academic year:', error)
    return {
      success: false,
      error: 'Failed to update academic year',
    }
  }
}

export async function deleteAcademicYear(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.academicYear.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await logActivity({
      userId: 'system',
      action: 'DELETE',
      entity: 'AcademicYear',
      entityId: id,
      details: `Deleted academic year`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete academic year:', error)
    return {
      success: false,
      error: 'Failed to delete academic year',
    }
  }
}

// ============ System Configuration ============

export async function getSystemConfigs() {
  try {
    const configs = await prisma.systemConfig.findMany({
      orderBy: { key: 'asc' },
    })

    return configs as SystemConfigItem[]
  } catch (error) {
    console.error('Failed to fetch system configs:', error)
    throw new Error('Failed to fetch system configs')
  }
}

export async function updateSystemConfig(
  key: string,
  value: string
): Promise<ActionResult<void>> {
  try {
    await prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
      },
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'SystemConfig',
      entityId: key,
      details: `Updated config: ${key}`,
    })

    revalidatePath('/dashboard/settings')
    revalidatePath('/') // Revalidate landing page

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update system config:', error)
    return {
      success: false,
      error: 'Failed to update system config',
    }
  }
}

// ============ User Management ============

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })

    return users as UserWithRelations[]
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function createUser(data: {
  email: string
  name: string
  password: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
}): Promise<ActionResult<UserWithRelations>> {
  try {
    // Check email uniqueness
    const existing = await prisma.user.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    })

    if (existing) {
      return {
        success: false,
        error: 'Email sudah digunakan',
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        isActive: true,
      },
    })

    await logActivity({
      userId: 'system',
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      details: `Created user: ${user.email}`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: user as UserWithRelations,
    }
  } catch (error) {
    console.error('Failed to create user:', error)
    return {
      success: false,
      error: 'Failed to create user',
    }
  }
}

export async function updateUser(
  id: string,
  data: {
    email?: string
    name?: string
    role?: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
    isActive?: boolean
  }
): Promise<ActionResult<void>> {
  try {
    // Check email uniqueness if email is being updated
    if (data.email) {
      const existing = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: id },
          deletedAt: null,
        },
      })

      if (existing) {
        return {
          success: false,
          error: 'Email sudah digunakan',
        }
      }
    }

    await prisma.user.update({
      where: { id, deletedAt: null },
      data,
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      details: `Updated user`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update user:', error)
    return {
      success: false,
      error: 'Failed to update user',
    }
  }
}

export async function resetUserPassword(
  id: string,
  newPassword: string
): Promise<ActionResult<void>> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id, deletedAt: null },
      data: { password: hashedPassword },
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      details: `Reset user password`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to reset password:', error)
    return {
      success: false,
      error: 'Failed to reset password',
    }
  }
}

export async function deleteUser(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await logActivity({
      userId: 'system',
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      details: `Deleted user`,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return {
      success: false,
      error: 'Failed to delete user',
    }
  }
}

// ============ Activity Log ============

export async function getActivityLogs(params: {
  userId?: string
  action?: string
  entity?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}) {
  const { userId, action, entity, startDate, endDate, page = 1, limit = 50 } = params

  try {
    const where: any = {}

    if (userId) where.userId = userId
    if (action) where.action = action
    if (entity) where.entity = entity
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ])

    return {
      logs: logs as ActivityLogWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Failed to fetch activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }
}

export async function exportActivityLogs(params: {
  userId?: string
  action?: string
  entity?: string
  startDate?: Date
  endDate?: Date
}) {
  const { userId, action, entity, startDate, endDate } = params

  try {
    const where: any = {}

    if (userId) where.userId = userId
    if (action) where.action = action
    if (entity) where.entity = entity
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const logs = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return logs as ActivityLogWithRelations[]
  } catch (error) {
    console.error('Failed to export activity logs:', error)
    throw new Error('Failed to export activity logs')
  }
}
