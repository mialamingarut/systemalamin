'use server';

import { prisma } from '@/lib/prisma';

export async function getTeachersForLanding() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        subjects: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
      take: 8, // Get up to 8 teachers
    });

    // Map to include position (default to 'Guru')
    return teachers.map(teacher => ({
      ...teacher,
      position: 'Guru',
    }));
  } catch (error) {
    console.error('Failed to fetch teachers for landing:', error);
    return [];
  }
}
