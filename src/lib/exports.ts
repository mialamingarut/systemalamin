import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

/**
 * Export data to Excel format
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
  filename: string
): void {
  // Transform data to match column headers
  const exportData = data.map((row) => {
    const transformedRow: Record<string, any> = {}
    columns.forEach((col) => {
      transformedRow[col.header] = row[col.key]
    })
    return transformedRow
  })

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData)

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}_${timestamp}.xlsx`

  // Trigger download
  XLSX.writeFile(workbook, fullFilename)
}

/**
 * Export data to PDF format
 */
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
  filename: string,
  title?: string
): void {
  const doc = new jsPDF()

  // Add title if provided
  if (title) {
    doc.setFontSize(16)
    doc.text(title, 14, 15)
  }

  // Prepare table data
  const headers = columns.map((col) => col.header)
  const rows = data.map((row) => columns.map((col) => String(row[col.key] || '-')))

  // Add table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: title ? 25 : 15,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }, // Blue color
  })

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}_${timestamp}.pdf`

  // Trigger download
  doc.save(fullFilename)
}

/**
 * Parse Excel file to JSON
 */
export async function parseExcelFile<T = any>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(new Error('Failed to parse Excel file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Validate Excel file format
 */
export function validateExcelFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.xlsx', '.xls']
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file format. Please upload ${validExtensions.join(' or ')} file.`,
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    }
  }

  return { valid: true }
}

/**
 * Export logs to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; header: string }>,
  filename: string
): void {
  // Create CSV header
  const headers = columns.map((col) => col.header).join(',')

  // Create CSV rows
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key]
      // Escape commas and quotes
      const stringValue = String(value || '')
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  )

  // Combine header and rows
  const csv = [headers, ...rows].join('\n')

  // Create blob and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}_${timestamp}.csv`

  link.setAttribute('href', url)
  link.setAttribute('download', fullFilename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
