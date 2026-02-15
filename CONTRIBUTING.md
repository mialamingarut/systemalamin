# 🤝 Contributing Guide

Terima kasih atas minat Anda untuk berkontribusi pada AL-AMIN School Management System!

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

Kami berkomitmen untuk menjadikan partisipasi dalam proyek ini sebagai pengalaman yang bebas dari pelecehan bagi semua orang.

### Our Standards

- Gunakan bahasa yang ramah dan inklusif
- Hormati sudut pandang dan pengalaman yang berbeda
- Terima kritik konstruktif dengan baik
- Fokus pada yang terbaik untuk komunitas
- Tunjukkan empati terhadap anggota komunitas lainnya

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. Fork repository
2. Clone fork Anda:
```bash
git clone https://github.com/YOUR_USERNAME/asms-alamin.git
cd asms-alamin
```

3. Install dependencies:
```bash
npm install
```

4. Setup database:
```bash
cp .env.example .env
# Edit .env dengan database credentials Anda
npm run db:push
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur-anda
```

### Making Changes

1. Buat perubahan di branch Anda
2. Test perubahan Anda
3. Commit dengan pesan yang jelas
4. Push ke fork Anda
5. Buat Pull Request

---

## Coding Standards

### TypeScript

- Gunakan TypeScript untuk semua file baru
- Definisikan types/interfaces yang jelas
- Hindari `any` type
- Gunakan strict mode

```typescript
// ✅ Good
interface Student {
  id: string;
  name: string;
  nis: string;
}

function getStudent(id: string): Promise<Student> {
  // ...
}

// ❌ Bad
function getStudent(id: any): any {
  // ...
}
```

### React Components

- Gunakan functional components
- Gunakan hooks (useState, useEffect, etc.)
- Extract reusable logic ke custom hooks
- Keep components small and focused

```typescript
// ✅ Good
export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>{student.nis}</p>
    </div>
  );
}

// ❌ Bad
export default function StudentCard(props: any) {
  return <div>{props.student.name}</div>;
}
```

### Naming Conventions

- **Components**: PascalCase (`StudentCard.tsx`)
- **Functions**: camelCase (`getStudentById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Files**: kebab-case (`student-list.tsx`)
- **CSS Classes**: kebab-case (`student-card`)

### File Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (landing)/         # Landing page routes
│   ├── dashboard/         # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── landing/          # Landing components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth config
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript types
```

### CSS/Tailwind

- Gunakan Tailwind utility classes
- Gunakan custom classes untuk patterns yang berulang
- Follow mobile-first approach
- Gunakan semantic class names

```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
  <button className="btn-primary">Action</button>
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
  <h3>{title}</h3>
</div>
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(students): add bulk import from Excel

- Add file upload component
- Implement Excel parsing
- Add validation for student data
- Show import progress

Closes #123

---

fix(spmb): fix registration number generation

The registration number was not unique when multiple users
registered at the same time. Added timestamp to ensure uniqueness.

Fixes #456

---

docs(readme): update installation instructions

Added PostgreSQL setup steps and troubleshooting section.
```

### Commit Best Practices

- Commit sering dengan perubahan kecil
- Setiap commit harus bisa di-build
- Tulis pesan commit yang deskriptif
- Reference issue numbers jika ada

---

## Pull Request Process

### Before Creating PR

1. ✅ Code sudah di-test
2. ✅ Tidak ada console.log yang tertinggal
3. ✅ Code sudah di-format (Prettier)
4. ✅ No TypeScript errors
5. ✅ Documentation updated (jika perlu)

### Creating PR

1. Push branch Anda ke fork
2. Buka Pull Request ke `develop` branch
3. Isi template PR dengan lengkap
4. Link related issues
5. Request review dari maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

### Review Process

- Maintainers akan review PR Anda
- Respond to feedback dengan cepat
- Make requested changes
- PR akan di-merge setelah approved

---

## Testing

### Manual Testing

1. Test di browser (Chrome, Firefox, Safari)
2. Test responsive design (mobile, tablet, desktop)
3. Test different user roles
4. Test edge cases

### Writing Tests (Future)

```typescript
// Example unit test
describe('generateRegistrationNumber', () => {
  it('should generate unique registration number', () => {
    const regNo1 = generateRegistrationNumber();
    const regNo2 = generateRegistrationNumber();
    expect(regNo1).not.toBe(regNo2);
  });

  it('should include current year', () => {
    const regNo = generateRegistrationNumber();
    const year = new Date().getFullYear();
    expect(regNo).toContain(year.toString());
  });
});
```

---

## Documentation

### Code Comments

```typescript
/**
 * Generate unique registration number for SPMB applicant
 * Format: SPMB-YYYY-XXXX
 * 
 * @returns {string} Registration number
 * @example
 * const regNo = generateRegistrationNumber();
 * // Returns: "SPMB-2026-0001"
 */
export function generateRegistrationNumber(): string {
  // Implementation
}
```

### README Updates

- Update README.md jika menambah fitur baru
- Update API.md jika menambah/mengubah API
- Update FEATURES.md untuk fitur baru
- Add examples untuk fitur kompleks

### Inline Documentation

- Explain WHY, not WHAT
- Document complex logic
- Add TODO comments untuk future improvements

```typescript
// ✅ Good
// Use bcrypt with 10 rounds for security vs performance balance
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ Bad
// Hash password
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## Common Tasks

### Adding New API Endpoint

1. Create route file in `src/app/api/`
2. Implement GET/POST/PUT/DELETE handlers
3. Add authentication check
4. Add validation
5. Add error handling
6. Add activity logging
7. Update API.md documentation

### Adding New Page

1. Create page file in `src/app/`
2. Create components in `src/components/`
3. Add to navigation (if needed)
4. Add authentication (if needed)
5. Test responsive design
6. Update documentation

### Adding New Database Table

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update seed file if needed
4. Create API endpoints
5. Update DATABASE.md
6. Add TypeScript types

---

## Getting Help

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Contact

- Email: dev@mialamin.sch.id
- GitHub Issues: [Create Issue](https://github.com/username/asms-alamin/issues)
- Discussions: [GitHub Discussions](https://github.com/username/asms-alamin/discussions)

---

## Recognition

Contributors akan ditambahkan ke:
- README.md Contributors section
- CONTRIBUTORS.md file
- Release notes

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to AL-AMIN School Management System! 🎉**
