import { describe, it, expect } from 'vitest'
import { validateExcelFile } from './exports'

describe('Export Utilities', () => {
  describe('validateExcelFile', () => {
    it('should accept .xlsx files', () => {
      const file = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const result = validateExcelFile(file)
      expect(result.valid).toBe(true)
    })

    it('should accept .xls files', () => {
      const file = new File([''], 'test.xls', { type: 'application/vnd.ms-excel' })
      const result = validateExcelFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject non-Excel files', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      const result = validateExcelFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file format')
    })

    it('should reject files larger than 10MB', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join('')
      const file = new File([largeContent], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const result = validateExcelFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File size exceeds 10MB limit')
    })

    it('should accept files under 10MB', () => {
      const smallContent = new Array(1024).fill('a').join('')
      const file = new File([smallContent], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const result = validateExcelFile(file)
      expect(result.valid).toBe(true)
    })
  })
})
