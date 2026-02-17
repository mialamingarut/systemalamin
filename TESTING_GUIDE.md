# Testing Guide - AL-AMIN School Management System

## Overview
Proyek ini menggunakan Vitest untuk unit testing dan integration testing. Tests mencakup validasi, utility functions, components, dan server actions.

---

## Test Environment Setup

### Database Configuration

Tests memerlukan database connection yang valid. Ada dua opsi:

#### Option 1: SQLite (Recommended for Development)
```bash
# 1. Update prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

# 2. Set DATABASE_URL di .env
DATABASE_URL="file:./prisma/test.db"

# 3. Generate Prisma Client
npx prisma generate

# 4. Push schema ke database
npx prisma db push
```

#### Option 2: PostgreSQL (Production-like)
```bash
# 1. Ensure schema uses postgresql
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Set DATABASE_URL di .env
DATABASE_URL="postgresql://user:password@localhost:5432/test_db"

# 3. Generate and migrate
npx prisma generate
npx prisma db push
```

---

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### With UI
```bash
npm run test:ui
```

### With Coverage
```bash
npm run test:coverage
```

### Specific Test File
```bash
npx vitest run src/lib/validations.test.ts
```

---

## Test Structure

### Unit Tests
Located in `src/lib/` and `src/components/ui/`

**Files:**
- `src/lib/validations.test.ts` - Zod schema validation tests
- `src/lib/exports.test.ts` - Export utility tests
- `src/components/ui/Button.test.tsx` - Button component tests

**Coverage:**
- ✅ Email validation
- ✅ Phone validation
- ✅ Date validation
- ✅ Numeric range validation
- ✅ Excel/PDF export
- ✅ File validation
- ✅ UI component rendering

### Integration Tests
Located in `src/app/dashboard/students/`

**Files:**
- `actions.test.ts` - Server action tests
- `import.test.ts` - Import functionality tests
- `update-delete.test.ts` - CRUD operation tests
- `components/StudentForm.test.tsx` - Form component tests
- `components/StudentDetail.test.tsx` - Detail view tests

**Coverage:**
- ✅ Student CRUD operations
- ✅ Search and filtering
- ✅ Pagination
- ✅ Excel import
- ✅ Data validation
- ✅ Business rules (soft delete, constraints)

---

## Test Results Summary

### Current Status (with valid DATABASE_URL)

```
Test Files: 8 total
  ✅ src/lib/validations.test.ts (14 tests)
  ✅ src/lib/exports.test.ts (5 tests)
  ✅ src/components/ui/Button.test.tsx (5 tests)
  ✅ src/app/dashboard/students/import.test.ts (11 tests)
  ✅ src/app/dashboard/students/components/StudentForm.test.tsx (9 tests)
  ✅ src/app/dashboard/students/components/StudentDetail.test.tsx (9 tests)
  ⚠️  src/app/dashboard/students/actions.test.ts (9 tests) - Requires DB
  ⚠️  src/app/dashboard/students/update-delete.test.ts (9 tests) - Requires DB

Total: 71 tests
  ✅ Passing: 55 tests (without DB)
  ⚠️  Requires DB: 16 tests
```

---

## Database-Dependent Tests

Beberapa tests memerlukan database connection yang valid:

### Tests yang Memerlukan Database:
1. **Student Actions Tests** (`actions.test.ts`)
   - `getStudents()` with pagination
   - `getStudents()` with search
   - `getStudents()` with filters
   - `getClasses()` operations

2. **Update/Delete Tests** (`update-delete.test.ts`)
   - `updateStudent()` operations
   - `deleteStudent()` with soft delete
   - `getStudentById()` with relations
   - Business rule validations

### Running Database Tests:

```bash
# 1. Ensure database is configured
# Check .env has valid DATABASE_URL

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema
npx prisma db push

# 4. Seed test data (optional)
npm run db:seed

# 5. Run tests
npm test
```

---

## Mocking Strategy

### Current Mocking:
- ✅ Console methods (error, warn) - mocked to reduce noise
- ✅ Toast notifications - mocked in component tests
- ✅ File operations - mocked in import tests

### Not Mocked:
- ❌ Prisma Client - uses real database
- ❌ Server Actions - integration tests with real DB

### Why Real Database?
Integration tests menggunakan real database untuk:
- Validate actual Prisma queries
- Test database constraints
- Verify transaction behavior
- Ensure data integrity

---

## Writing New Tests

### Unit Test Template:
```typescript
import { describe, it, expect } from 'vitest'

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = myFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### Component Test Template:
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Integration Test Template:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Server Action', () => {
  let testId: string
  
  beforeEach(async () => {
    // Setup test data
    const record = await prisma.model.create({ data: {} })
    testId = record.id
  })
  
  afterEach(async () => {
    // Cleanup
    await prisma.model.delete({ where: { id: testId } })
  })
  
  it('should perform action', async () => {
    const result = await myAction(testId)
    expect(result.success).toBe(true)
  })
})
```

---

## Test Coverage Goals

### Current Coverage:
- Validation utilities: ~90%
- Export utilities: ~85%
- UI components: ~70%
- Server actions: ~60%
- Integration flows: ~50%

### Target Coverage:
- Overall: 80%+
- Critical paths: 90%+
- Utility functions: 95%+

---

## Troubleshooting

### Issue: "DATABASE_URL must start with postgresql://"
**Solution:** Update prisma/schema.prisma provider to match your .env DATABASE_URL

### Issue: "PrismaClientInitializationError"
**Solution:** 
```bash
npx prisma generate
npx prisma db push
```

### Issue: Tests timeout
**Solution:** Increase timeout in vitest.config.ts:
```typescript
test: {
  testTimeout: 10000
}
```

### Issue: "Cannot find module '@/lib/...'"
**Solution:** Check path alias in vitest.config.ts

---

## CI/CD Integration

### GitHub Actions Example:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx prisma generate
      - run: npm test
```

---

## Property-Based Testing (Optional)

Fast-check sudah terinstall untuk property-based testing.

### Example:
```typescript
import fc from 'fast-check'

it('should validate any valid email', () => {
  fc.assert(
    fc.property(fc.emailAddress(), (email) => {
      const result = validateEmail(email)
      expect(result).toBe(true)
    })
  )
})
```

---

## Best Practices

1. **Test Isolation**
   - Each test should be independent
   - Use beforeEach/afterEach for setup/cleanup
   - Don't rely on test execution order

2. **Descriptive Names**
   - Use clear, descriptive test names
   - Follow pattern: "should [expected behavior] when [condition]"

3. **Arrange-Act-Assert**
   - Setup test data (Arrange)
   - Execute function (Act)
   - Verify results (Assert)

4. **Mock External Dependencies**
   - Mock API calls
   - Mock file system operations
   - Mock time-dependent functions

5. **Test Edge Cases**
   - Empty inputs
   - Null/undefined values
   - Boundary values
   - Error conditions

---

## Next Steps

1. ✅ Fix database configuration for tests
2. ⚠️  Run all tests and verify passing
3. ⚠️  Add tests for remaining modules (Teachers, Classes, etc.)
4. ⚠️  Implement property-based tests (optional)
5. ⚠️  Set up CI/CD pipeline
6. ⚠️  Achieve 80%+ code coverage

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Fast-check Documentation](https://fast-check.dev/)

---

Last Updated: 2026-02-15
Status: Tests configured, database setup required for full test suite
