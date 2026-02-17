import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Set test environment variables
process.env.DATABASE_URL = 'file:./prisma/test.db'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
