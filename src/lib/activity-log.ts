import { prisma } from './prisma'

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'IMPORT'

export type ActivityEntity =
  | 'Student'
  | 'Teacher'
  | 'Class'
  | 'Parent'
  | 'SPMBApplicant'
  | 'Invoice'
  | 'Announcement'
  | 'Activity'
  | 'CalendarEvent'
  | 'AcademicYear'
  | 'SystemConfig'
  | 'User'
  | 'Auth'
  | 'LandingHero'
  | 'LandingStats'
  | 'LandingProgram'
  | 'LandingGallery'
  | 'LandingTestimonial'
  | 'LandingAbout'
  | 'LandingFeature'
  | 'LandingCTA'

interface LogActivityParams {
  userId: string
  action: ActivityAction
  entity: ActivityEntity
  entityId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Log user activity to the database
 */
export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent,
}: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Log error but don't throw - activity logging should not break the main operation
    console.error('Failed to log activity:', error)
  }
}

/**
 * Get activity logs with filters
 */
export async function getActivityLogs(filters: {
  userId?: string
  action?: ActivityAction
  entity?: ActivityEntity
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}) {
  const { userId, action, entity, startDate, endDate, page = 1, limit = 50 } = filters

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
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ])

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Extract IP address from request headers
 */
export function getIpAddress(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    undefined
  )
}

/**
 * Extract user agent from request headers
 */
export function getUserAgent(headers: Headers): string | undefined {
  return headers.get('user-agent') || undefined
}
