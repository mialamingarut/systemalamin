'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export interface CalendarEventWithRelations {
  id: string
  title: string
  description: string
  date: Date
  academicYearId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  academicYear: {
    id: string
    name: string
  } | null
}

export interface AnnouncementWithRelations {
  id: string
  title: string
  content: string
  isPinned: boolean
  publishedAt: Date
  academicYearId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  academicYear: {
    id: string
    name: string
  } | null
}

export interface ActivityWithRelations {
  id: string
  title: string
  description: string
  date: Date
  location: string | null
  photos: string[] // PostgreSQL array type
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ============ Calendar Events ============

export async function getCalendarEvents(academicYearId?: string) {
  try {
    const where: any = {
      deletedAt: null,
    }

    if (academicYearId) {
      where.academicYearId = academicYearId
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return events as CalendarEventWithRelations[]
  } catch (error) {
    console.error('Failed to fetch calendar events:', error)
    throw new Error('Failed to fetch calendar events')
  }
}

export async function createCalendarEvent(data: {
  title: string
  description: string
  date: Date
  academicYearId?: string
}): Promise<ActionResult<CalendarEventWithRelations>> {
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        academicYearId: data.academicYearId,
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await logActivity({
      userId: 'system',
      action: 'CREATE',
      entity: 'CalendarEvent',
      entityId: event.id,
      details: `Created calendar event: ${event.title}`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
      data: event as CalendarEventWithRelations,
    }
  } catch (error) {
    console.error('Failed to create calendar event:', error)
    return {
      success: false,
      error: 'Failed to create calendar event',
    }
  }
}

export async function updateCalendarEvent(
  id: string,
  data: {
    title?: string
    description?: string
    date?: Date
    endDate?: Date
    location?: string
  }
): Promise<ActionResult<void>> {
  try {
    await prisma.calendarEvent.update({
      where: { id, deletedAt: null },
      data,
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'CalendarEvent',
      entityId: id,
      details: `Updated calendar event`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update calendar event:', error)
    return {
      success: false,
      error: 'Failed to update calendar event',
    }
  }
}

export async function deleteCalendarEvent(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.calendarEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await logActivity({
      userId: 'system',
      action: 'DELETE',
      entity: 'CalendarEvent',
      entityId: id,
      details: `Deleted calendar event`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete calendar event:', error)
    return {
      success: false,
      error: 'Failed to delete calendar event',
    }
  }
}

// ============ Announcements ============

export async function getAnnouncements(academicYearId?: string) {
  try {
    const where: any = {
      deletedAt: null,
    }

    if (academicYearId) {
      where.academicYearId = academicYearId
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' },
      ],
    })

    return announcements as AnnouncementWithRelations[]
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    throw new Error('Failed to fetch announcements')
  }
}

export async function createAnnouncement(data: {
  title: string
  content: string
  isPinned?: boolean
  publishedAt?: Date
  academicYearId?: string
}): Promise<ActionResult<AnnouncementWithRelations>> {
  try {
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        isPinned: data.isPinned || false,
        publishedAt: data.publishedAt || new Date(),
        academicYearId: data.academicYearId,
      },
      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await logActivity({
      userId: 'system',
      action: 'CREATE',
      entity: 'Announcement',
      entityId: announcement.id,
      details: `Created announcement: ${announcement.title}`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
      data: announcement as AnnouncementWithRelations,
    }
  } catch (error) {
    console.error('Failed to create announcement:', error)
    return {
      success: false,
      error: 'Failed to create announcement',
    }
  }
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string
    content?: string
    isPinned?: boolean
    publishedAt?: Date
  }
): Promise<ActionResult<void>> {
  try {
    await prisma.announcement.update({
      where: { id, deletedAt: null },
      data,
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'Announcement',
      entityId: id,
      details: `Updated announcement`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update announcement:', error)
    return {
      success: false,
      error: 'Failed to update announcement',
    }
  }
}

export async function deleteAnnouncement(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.announcement.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await logActivity({
      userId: 'system',
      action: 'DELETE',
      entity: 'Announcement',
      entityId: id,
      details: `Deleted announcement`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete announcement:', error)
    return {
      success: false,
      error: 'Failed to delete announcement',
    }
  }
}

// ============ Activities ============

export async function getActivities(academicYearId?: string) {
  try {
    const where: any = {
      deletedAt: null,
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    })

    return activities as ActivityWithRelations[]
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    throw new Error('Failed to fetch activities')
  }
}

export async function createActivity(data: {
  title: string
  description: string
  date: Date
  location?: string
  photos?: string
}): Promise<ActionResult<ActivityWithRelations>> {
  try {
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
        photos: data.photos ? JSON.parse(data.photos) : [], // Parse JSON string to array
      },
    })

    await logActivity({
      userId: 'system',
      action: 'CREATE',
      entity: 'Activity',
      entityId: activity.id,
      details: `Created activity: ${activity.title}`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
      data: activity as ActivityWithRelations,
    }
  } catch (error) {
    console.error('Failed to create activity:', error)
    return {
      success: false,
      error: 'Failed to create activity',
    }
  }
}

export async function updateActivity(
  id: string,
  data: {
    title?: string
    description?: string
    date?: Date
    location?: string
    photos?: string
  }
): Promise<ActionResult<void>> {
  try {
    // Parse photos if provided
    const updateData: any = { ...data }
    if (data.photos) {
      updateData.photos = JSON.parse(data.photos)
    }
    
    await prisma.activity.update({
      where: { id, deletedAt: null },
      data: updateData,
    })

    await logActivity({
      userId: 'system',
      action: 'UPDATE',
      entity: 'Activity',
      entityId: id,
      details: `Updated activity`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to update activity:', error)
    return {
      success: false,
      error: 'Failed to update activity',
    }
  }
}

export async function deleteActivity(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.activity.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await logActivity({
      userId: 'system',
      action: 'DELETE',
      entity: 'Activity',
      entityId: id,
      details: `Deleted activity`,
    })

    revalidatePath('/dashboard/academic')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Failed to delete activity:', error)
    return {
      success: false,
      error: 'Failed to delete activity',
    }
  }
}
