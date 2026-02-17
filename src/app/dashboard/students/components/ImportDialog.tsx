'use client'

import { useState, useRef } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { importStudents, generateImportTemplate, ImportResult, ImportError } from '../actions'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportDialog({ open, onClose, onSuccess }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file extension
      const validExtensions = ['.xlsx', '.xls']
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
      
      if (!validExtensions.includes(fileExtension)) {
        alert('Invalid file format. Please upload .xlsx or .xls file.')
        return
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (selectedFile.size > maxSize) {
        alert('File size exceeds 10MB limit.')
        return
      }

      setFile(selectedFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file to import')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Array.from(new Uint8Array(arrayBuffer))

      // Call import action
      const importResult = await importStudents(buffer)
      setResult(importResult)

      if (importResult.success && importResult.imported > 0) {
        // Show success message
        setTimeout(() => {
          onSuccess()
          handleClose()
        }, 3000)
      }
    } catch (error: any) {
      console.error('Import error:', error)
      setResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: [{ row: 0, message: error.message || 'Failed to import file' }],
        summary: 'Import failed',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const buffer = await generateImportTemplate()
      const blob = new Blob([new Uint8Array(buffer)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'student_import_template.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download template:', error)
      alert('Failed to download template')
    }
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    setShowErrors(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Import Students from Excel" size="lg">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Import Instructions</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Download the template file to see the required format</li>
            <li>Fill in student data following the template structure</li>
            <li>Required columns: NIS, Name, Gender, Date of Birth, Place of Birth, Address, Parent ID, Enrollment Date</li>
            <li>Optional columns: NISN, Phone, Photo</li>
            <li>Date format: YYYY-MM-DD or DD/MM/YYYY</li>
            <li>Gender values: MALE or FEMALE</li>
            <li>File format: .xlsx or .xls (max 10MB)</li>
          </ul>
        </div>

        {/* Download Template Button */}
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Import Result */}
        {result && (
          <div
            className={`rounded-lg p-4 ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}
            >
              Import {result.success ? 'Completed' : 'Failed'}
            </h4>
            <p
              className={`text-sm mb-3 ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.summary}
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-600">Imported</p>
                <p className="text-2xl font-bold text-green-600">{result.imported}</p>
              </div>
              <div className="bg-white rounded p-3">
                <p className="text-xs text-gray-600">Skipped</p>
                <p className="text-2xl font-bold text-red-600">{result.skipped}</p>
              </div>
            </div>

            {/* Error Details */}
            {result.errors.length > 0 && (
              <div>
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center"
                >
                  {showErrors ? 'Hide' : 'Show'} Error Details ({result.errors.length})
                  <svg
                    className={`w-4 h-4 ml-1 transform transition-transform ${
                      showErrors ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showErrors && (
                  <div className="mt-3 max-h-64 overflow-y-auto bg-white rounded border border-red-200 p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Row</th>
                          <th className="text-left py-2 px-2">Field</th>
                          <th className="text-left py-2 px-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((error, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2 px-2 font-mono">{error.row}</td>
                            <td className="py-2 px-2 font-medium">{error.field || '-'}</td>
                            <td className="py-2 px-2 text-red-700">{error.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose}>
            {result?.success ? 'Close' : 'Cancel'}
          </Button>
          {!result?.success && (
            <Button
              type="button"
              onClick={handleImport}
              disabled={!file || loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
