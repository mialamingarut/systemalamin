'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activity-log'

export interface GetStudentsParams {
  page?: number
  search?: string
  classId?: string
  status?: 'active' | 'inactive' | 'all'
}

export interface StudentWithRelations {
  id: string
  nis: string
  nisn: string | null
  name: string
  gender: 'MALE' | 'FEMALE'
  dateOfBirth: Date
  placeOfBirth: string
  address: string
  phone: string | null
  photo: string | null
  parentId: string
  enrollmentDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  parent: {
    id: string
    fatherName: string
    motherName: string
    phone: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  classStudents: Array<{
    id: string
    class: {
      id: string
      name: string
      grade: number
    }
  }>
}

/**
 * Get students with pagination, search, and filters
 */
export async function getStudents(params: GetStudentsParams = {}) {
  const { page = 1, search = '', classId, status = 'all' } = params
  const pageSize = 20
  const skip = (page - 1) * pageSize

  try {
    // Build where clause
    const where: any = {
      deletedAt: null,
    }

    // Status filter
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Search filter (name, NIS, or parent name)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        {
          parent: {
            user: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ]
    }

    // Class filter
    if (classId) {
      where.classStudents = {
        some: {
          classId: classId,
        },
      }
    }

    // Fetch students and total count
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          parent: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          classStudents: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                  grade: true,
                },
              },
            },
            where: {
              class: {
                deletedAt: null,
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip,
        take: pageSize,
      }),
      prisma.student.count({ where }),
    ])

    return {
      students: students as StudentWithRelations[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  } catch (error) {
    console.error('Failed to fetch students:', error)
    throw new Error('Failed to fetch students')
  }
}

/**
 * Get all classes for filter dropdown
 */
export async function getClasses() {
  try {
    const classes = await prisma.class.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        grade: true,
      },
      orderBy: [
        { grade: 'asc' },
        { name: 'asc' },
      ],
    })

    return classes
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    return []
  }
}

/**
 * Get all parents for parent selection dropdown
 */
export async function getParents() {
  try {
    const parents = await prisma.parent.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    })

    return parents
  } catch (error) {
    console.error('Failed to fetch parents:', error)
    return []
  }
}

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Create a new student
 */
export async function createStudent(formData: FormData): Promise<ActionResult<StudentWithRelations>> {
  try {
    // Extract and validate data
    const data = {
      nis: formData.get('nis') as string,
      nisn: formData.get('nisn') as string || undefined,
      name: formData.get('name') as string,
      gender: formData.get('gender') as 'MALE' | 'FEMALE',
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      placeOfBirth: formData.get('placeOfBirth') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string || undefined,
      photo: formData.get('photo') as string || undefined,
      parentId: formData.get('parentId') as string,
      enrollmentDate: new Date(formData.get('enrollmentDate') as string),
    }

    // Import validation schema
    const { studentSchema } = await import('@/lib/validations')
    
    // Validate with Zod
    const validated = studentSchema.parse(data)

    // Check for duplicate NIS
    const existingStudent = await prisma.student.findUnique({
      where: { nis: validated.nis },
    })

    if (existingStudent) {
      return {
        success: false,
        error: 'NIS already exists',
        fieldErrors: { nis: ['This NIS is already registered'] },
      }
    }

    // Check for duplicate NISN if provided
    if (validated.nisn) {
      const existingNISN = await prisma.student.findFirst({
        where: { nisn: validated.nisn },
      })

      if (existingNISN) {
        return {
          success: false,
          error: 'NISN already exists',
          fieldErrors: { nisn: ['This NISN is already registered'] },
        }
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        ...validated,
        isActive: true,
      },
      include: {
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        classStudents: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'CREATE',
      entity: 'Student',
      entityId: student.id,
      details: `Created student: ${student.name} (${student.nis})`,
    })

    // Revalidate the students page
    revalidatePath('/dashboard/students')

    return {
      success: true,
      data: student as StudentWithRelations,
    }
  } catch (error: any) {
    console.error('Failed to create student:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to create student',
    }
  }
}

/**
 * Get a single student by ID with full details including invoices
 */
export async function getStudentById(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id, deletedAt: null },
      include: {
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        classStudents: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
                academicYear: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          where: {
            class: {
              deletedAt: null,
            },
          },
        },
        invoices: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Get last 10 invoices
        },
      },
    })

    return student
  } catch (error) {
    console.error('Failed to fetch student:', error)
    return null
  }
}

/**
 * Update an existing student
 */
export async function updateStudent(
  id: string,
  formData: FormData
): Promise<ActionResult<StudentWithRelations>> {
  try {
    // Extract and validate data
    const data = {
      nis: formData.get('nis') as string,
      nisn: formData.get('nisn') as string || undefined,
      name: formData.get('name') as string,
      gender: formData.get('gender') as 'MALE' | 'FEMALE',
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      placeOfBirth: formData.get('placeOfBirth') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string || undefined,
      photo: formData.get('photo') as string || undefined,
      parentId: formData.get('parentId') as string,
      enrollmentDate: new Date(formData.get('enrollmentDate') as string),
    }

    // Import validation schema
    const { studentSchema } = await import('@/lib/validations')
    
    // Validate with Zod
    const validated = studentSchema.parse(data)

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id, deletedAt: null },
    })

    if (!existingStudent) {
      return {
        success: false,
        error: 'Student not found',
      }
    }

    // Check for duplicate NIS (excluding current student)
    if (validated.nis !== existingStudent.nis) {
      const duplicateNIS = await prisma.student.findUnique({
        where: { nis: validated.nis },
      })

      if (duplicateNIS) {
        return {
          success: false,
          error: 'NIS already exists',
          fieldErrors: { nis: ['This NIS is already registered'] },
        }
      }
    }

    // Check for duplicate NISN if provided (excluding current student)
    if (validated.nisn && validated.nisn !== existingStudent.nisn) {
      const duplicateNISN = await prisma.student.findFirst({
        where: { nisn: validated.nisn },
      })

      if (duplicateNISN) {
        return {
          success: false,
          error: 'NISN already exists',
          fieldErrors: { nisn: ['This NISN is already registered'] },
        }
      }
    }

    // Update student
    const student = await prisma.student.update({
      where: { id },
      data: validated,
      include: {
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        classStudents: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
        },
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'UPDATE',
      entity: 'Student',
      entityId: student.id,
      details: `Updated student: ${student.name} (${student.nis})`,
    })

    // Revalidate the students page
    revalidatePath('/dashboard/students')

    return {
      success: true,
      data: student as StudentWithRelations,
    }
  } catch (error: any) {
    console.error('Failed to update student:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return {
        success: false,
        error: 'Validation failed',
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to update student',
    }
  }
}

/**
 * Delete a student (soft delete)
 */
export async function deleteStudent(id: string): Promise<ActionResult<void>> {
  try {
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id, deletedAt: null },
      include: {
        invoices: {
          where: {
            status: {
              in: ['PENDING', 'OVERDUE'],
            },
            deletedAt: null,
          },
        },
      },
    })

    if (!student) {
      return {
        success: false,
        error: 'Student not found',
      }
    }

    // Check for unpaid invoices
    if (student.invoices.length > 0) {
      return {
        success: false,
        error: 'Cannot delete student with unpaid invoices',
      }
    }

    // Perform soft delete
    await prisma.student.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    })

    // Log activity
    await logActivity({
      userId: 'system', // TODO: Get from session
      action: 'DELETE',
      entity: 'Student',
      entityId: id,
      details: `Deleted student: ${student.name} (${student.nis})`,
    })

    // Revalidate the students page
    revalidatePath('/dashboard/students')

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Failed to delete student:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete student',
    }
  }
}

/**
 * Import students from Excel file
 */
export interface ImportError {
  row: number
  field?: string
  message: string
  data?: any
}

export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: ImportError[]
  summary: string
}

export async function importStudents(fileBuffer: number[]): Promise<ImportResult> {
  try {
    const XLSX = await import('xlsx')
    
    // Convert buffer array back to Buffer
    const buffer = Buffer.from(fileBuffer)
    
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
    
    if (rawData.length === 0) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        errors: [{ row: 0, message: 'Excel file is empty' }],
        summary: 'No data found in the Excel file',
      }
    }

    // Define expected columns (template structure)
    const requiredColumns = [
      'NIS',
      'Name',
      'Gender',
      'Date of Birth',
      'Place of Birth',
      'Address',
      'Parent ID',
      'Enrollment Date',
    ]

    const optionalColumns = ['NISN', 'Phone', 'Photo']

    // Validate file structure
    const firstRow: any = rawData[0]
    const fileColumns = Object.keys(firstRow)
    
    const missingColumns = requiredColumns.filter(
      (col) => !fileColumns.includes(col)
    )

    if (missingColumns.length > 0) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        errors: [
          {
            row: 0,
            message: `Missing required columns: ${missingColumns.join(', ')}`,
          },
        ],
        summary: 'File structure does not match the expected template',
      }
    }

    // Import validation schema
    const { studentSchema } = await import('@/lib/validations')

    const errors: ImportError[] = []
    const validRows: any[] = []
    const duplicateNIS: string[] = []

    // Validate each row
    for (let i = 0; i < rawData.length; i++) {
      const row: any = rawData[i]
      const rowNumber = i + 2 // Excel row number (1-indexed + header row)

      try {
        // Check for empty rows
        if (!row['NIS'] && !row['Name']) {
          continue // Skip empty rows
        }

        // Parse date fields
        let dateOfBirth: Date
        let enrollmentDate: Date

        try {
          dateOfBirth = parseExcelDate(row['Date of Birth'])
        } catch (error) {
          errors.push({
            row: rowNumber,
            field: 'Date of Birth',
            message: 'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY',
            data: row['Date of Birth'],
          })
          continue
        }

        try {
          enrollmentDate = parseExcelDate(row['Enrollment Date'])
        } catch (error) {
          errors.push({
            row: rowNumber,
            field: 'Enrollment Date',
            message: 'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY',
            data: row['Enrollment Date'],
          })
          continue
        }

        // Validate gender
        const gender = row['Gender']?.toUpperCase()
        if (gender !== 'MALE' && gender !== 'FEMALE') {
          errors.push({
            row: rowNumber,
            field: 'Gender',
            message: 'Gender must be MALE or FEMALE',
            data: row['Gender'],
          })
          continue
        }

        // Build student data object
        const studentData = {
          nis: String(row['NIS']).trim(),
          nisn: row['NISN'] ? String(row['NISN']).trim() : undefined,
          name: String(row['Name']).trim(),
          gender: gender as 'MALE' | 'FEMALE',
          dateOfBirth,
          placeOfBirth: String(row['Place of Birth']).trim(),
          address: String(row['Address']).trim(),
          phone: row['Phone'] ? String(row['Phone']).trim() : undefined,
          photo: row['Photo'] ? String(row['Photo']).trim() : undefined,
          parentId: String(row['Parent ID']).trim(),
          enrollmentDate,
        }

        // Validate with Zod schema
        const validated = studentSchema.parse(studentData)

        // Check for duplicate NIS in database
        const existingStudent = await prisma.student.findUnique({
          where: { nis: validated.nis },
        })

        if (existingStudent) {
          duplicateNIS.push(validated.nis)
          errors.push({
            row: rowNumber,
            field: 'NIS',
            message: `NIS ${validated.nis} already exists in database`,
            data: validated.nis,
          })
          continue
        }

        // Check for duplicate NIS within the import file
        const duplicateInFile = validRows.find((r) => r.nis === validated.nis)
        if (duplicateInFile) {
          duplicateNIS.push(validated.nis)
          errors.push({
            row: rowNumber,
            field: 'NIS',
            message: `Duplicate NIS ${validated.nis} found in import file`,
            data: validated.nis,
          })
          continue
        }

        // Check for duplicate NISN if provided
        if (validated.nisn) {
          const existingNISN = await prisma.student.findFirst({
            where: { nisn: validated.nisn },
          })

          if (existingNISN) {
            errors.push({
              row: rowNumber,
              field: 'NISN',
              message: `NISN ${validated.nisn} already exists in database`,
              data: validated.nisn,
            })
            continue
          }

          const duplicateNISNInFile = validRows.find(
            (r) => r.nisn === validated.nisn
          )
          if (duplicateNISNInFile) {
            errors.push({
              row: rowNumber,
              field: 'NISN',
              message: `Duplicate NISN ${validated.nisn} found in import file`,
              data: validated.nisn,
            })
            continue
          }
        }

        // Verify parent exists
        const parent = await prisma.parent.findUnique({
          where: { id: validated.parentId, deletedAt: null },
        })

        if (!parent) {
          errors.push({
            row: rowNumber,
            field: 'Parent ID',
            message: `Parent with ID ${validated.parentId} not found`,
            data: validated.parentId,
          })
          continue
        }

        validRows.push(validated)
      } catch (error: any) {
        // Handle Zod validation errors
        if (error.name === 'ZodError') {
          const zodErrors = error.flatten().fieldErrors
          Object.keys(zodErrors).forEach((field) => {
            errors.push({
              row: rowNumber,
              field,
              message: zodErrors[field][0],
              data: row[field],
            })
          })
        } else {
          errors.push({
            row: rowNumber,
            message: error.message || 'Unknown validation error',
          })
        }
      }
    }

    // If there are valid rows, import them
    let imported = 0
    if (validRows.length > 0) {
      try {
        // Create students in bulk
        const createResult = await prisma.student.createMany({
          data: validRows.map((row) => ({
            ...row,
            isActive: true,
          })),
        })

        imported = createResult.count

        // Log activity
        await logActivity({
          userId: 'system', // TODO: Get from session
          action: 'IMPORT',
          entity: 'Student',
          details: `Imported ${imported} students from Excel file`,
        })

        // Revalidate the students page
        revalidatePath('/dashboard/students')
      } catch (error: any) {
        console.error('Failed to import students:', error)
        return {
          success: false,
          imported: 0,
          skipped: validRows.length,
          errors: [
            {
              row: 0,
              message: `Database error: ${error.message}`,
            },
          ],
          summary: 'Failed to save students to database',
        }
      }
    }

    const skipped = errors.length
    const totalRows = rawData.length

    // Generate summary
    let summary = `Processed ${totalRows} rows: ${imported} imported, ${skipped} skipped`
    if (duplicateNIS.length > 0) {
      summary += `. ${duplicateNIS.length} duplicate NIS values found.`
    }

    return {
      success: imported > 0,
      imported,
      skipped,
      errors,
      summary,
    }
  } catch (error: any) {
    console.error('Import error:', error)
    return {
      success: false,
      imported: 0,
      skipped: 0,
      errors: [
        {
          row: 0,
          message: error.message || 'Failed to process Excel file',
        },
      ],
      summary: 'Import failed due to an unexpected error',
    }
  }
}

/**
 * Helper function to parse Excel date formats
 */
function parseExcelDate(dateValue: any): Date {
  if (!dateValue) {
    throw new Error('Date is required')
  }

  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue
  }

  // If it's a number (Excel serial date)
  if (typeof dateValue === 'number') {
    // Excel dates are days since 1900-01-01 (with a bug for 1900 being a leap year)
    const excelEpoch = new Date(1900, 0, 1)
    const days = dateValue - 2 // Adjust for Excel's leap year bug
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000)
    return date
  }

  // If it's a string, try to parse it
  if (typeof dateValue === 'string') {
    const trimmed = dateValue.trim()

    // Try ISO format (YYYY-MM-DD)
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }

    // Try DD/MM/YYYY format
    const ddmmyyyyMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }

    // Try MM/DD/YYYY format
    const mmddyyyyMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (mmddyyyyMatch) {
      const [, month, day, year] = mmddyyyyMatch
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }

    // Try parsing with Date constructor
    const parsed = new Date(trimmed)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }

  throw new Error(`Invalid date format: ${dateValue}`)
}

/**
 * Generate Excel template for student import
 */
export async function generateImportTemplate(): Promise<Buffer> {
  const XLSX = await import('xlsx')

  // Define template structure
  const templateData = [
    {
      'NIS': '2026001',
      'NISN': '1234567890',
      'Name': 'John Doe',
      'Gender': 'MALE',
      'Date of Birth': '2015-01-15',
      'Place of Birth': 'Jakarta',
      'Address': 'Jl. Example No. 123, Jakarta',
      'Phone': '081234567890',
      'Photo': '',
      'Parent ID': 'parent-id-here',
      'Enrollment Date': '2026-07-01',
    },
  ]

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData)

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // NIS
    { wch: 15 }, // NISN
    { wch: 25 }, // Name
    { wch: 10 }, // Gender
    { wch: 15 }, // Date of Birth
    { wch: 20 }, // Place of Birth
    { wch: 40 }, // Address
    { wch: 15 }, // Phone
    { wch: 30 }, // Photo
    { wch: 25 }, // Parent ID
    { wch: 15 }, // Enrollment Date
  ]

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  return buffer
}

/**
 * Get all students for export (no pagination, applies current filters)
 */
export async function getAllStudentsForExport(params: {
  search?: string
  classId?: string
  status?: 'active' | 'inactive' | 'all'
} = {}) {
  const { search = '', classId, status = 'all' } = params

  try {
    // Build where clause (same as getStudents)
    const where: any = {
      deletedAt: null,
    }

    // Status filter
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        {
          parent: {
            user: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ]
    }

    // Class filter
    if (classId) {
      where.classStudents = {
        some: {
          classId: classId,
        },
      }
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        parent: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        classStudents: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
              },
            },
          },
          where: {
            class: {
              deletedAt: null,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return students as StudentWithRelations[]
  } catch (error) {
    console.error('Failed to fetch students for export:', error)
    throw new Error('Failed to fetch students for export')
  }
}
