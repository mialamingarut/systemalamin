import { NextRequest, NextResponse } from 'next/server'
import { validateExcelFile } from '@/lib/exports'

/**
 * API route for handling Excel file uploads for student import
 * POST /api/students/import
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file format
    const validation = validateExcelFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Return file data for processing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        size: file.size,
        buffer: Array.from(buffer), // Convert to array for JSON serialization
      },
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
