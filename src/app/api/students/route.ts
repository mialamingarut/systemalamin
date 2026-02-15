import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/students - List all students
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          parent: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          classStudents: {
            include: {
              class: {
                include: {
                  academicYear: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nis,
      nisn,
      name,
      gender,
      dateOfBirth,
      placeOfBirth,
      address,
      phone,
      parentId,
      enrollmentDate,
    } = body;

    // Validate required fields
    if (!nis || !name || !gender || !dateOfBirth || !placeOfBirth || !address || !parentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if NIS already exists
    const existingStudent = await prisma.student.findUnique({
      where: { nis },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'NIS already exists' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        nis,
        nisn,
        name,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        placeOfBirth,
        address,
        phone,
        parentId,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
        isActive: true,
      },
      include: {
        parent: true,
      },
    });

    // Log activity
    if (session.user?.id) {
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'CREATE',
          entity: 'Student',
          entityId: student.id,
          details: JSON.stringify({ name: student.name, nis: student.nis }),
        },
      });
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
