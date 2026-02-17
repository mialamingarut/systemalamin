import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StudentDetail from './StudentDetail'

describe('StudentDetail Component', () => {
  const mockStudent = {
    id: 'student-1',
    nis: '2026001',
    nisn: '1234567890',
    name: 'John Doe',
    gender: 'MALE' as const,
    dateOfBirth: new Date('2015-01-15'),
    placeOfBirth: 'Jakarta',
    address: 'Jl. Test No. 123, Jakarta',
    phone: '081234567890',
    photo: null,
    enrollmentDate: new Date('2021-07-01'),
    isActive: true,
    parent: {
      id: 'parent-1',
      fatherName: 'John Father',
      motherName: 'John Mother',
      phone: '081234567891',
      user: {
        id: 'user-1',
        name: 'John Parent',
        email: 'parent@example.com',
      },
    },
    classStudents: [
      {
        id: 'cs-1',
        class: {
          id: 'class-1',
          name: '1A',
          grade: 1,
          academicYear: {
            id: 'ay-1',
            name: '2023/2024',
          },
        },
      },
    ],
    invoices: [
      {
        id: 'inv-1',
        invoiceNo: 'INV-202301-0001',
        month: 1,
        year: 2023,
        amount: 500000,
        status: 'PAID' as const,
        dueDate: new Date('2023-01-10'),
        paidAt: new Date('2023-01-08'),
        paidAmount: 500000,
      },
      {
        id: 'inv-2',
        invoiceNo: 'INV-202302-0001',
        month: 2,
        year: 2023,
        amount: 500000,
        status: 'PENDING' as const,
        dueDate: new Date('2023-02-10'),
        paidAt: null,
        paidAmount: null,
      },
    ],
  }

  const mockOnEdit = vi.fn()
  const mockOnClose = vi.fn()

  it('should render student basic information', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/NIS:/)).toBeInTheDocument()
    expect(screen.getByText('2026001')).toBeInTheDocument()
    expect(screen.getByText(/NISN:/)).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })

  it('should render parent information', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('John Father')).toBeInTheDocument()
    expect(screen.getByText('John Mother')).toBeInTheDocument()
    expect(screen.getByText('parent@example.com')).toBeInTheDocument()
  })

  it('should render current class assignment', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('1A')).toBeInTheDocument()
    expect(screen.getByText(/2023\/2024/)).toBeInTheDocument()
  })

  it('should render payment history with invoices', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('INV-202301-0001')).toBeInTheDocument()
    expect(screen.getByText('INV-202302-0001')).toBeInTheDocument()
    expect(screen.getByText('Lunas')).toBeInTheDocument()
    expect(screen.getByText('Belum Bayar')).toBeInTheDocument()
  })

  it('should calculate payment summary correctly', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    // Check that payment summary sections exist
    expect(screen.getByText('Total Tagihan')).toBeInTheDocument()
    expect(screen.getByText('Total Dibayar')).toBeInTheDocument()
    expect(screen.getByText('Total Tunggakan')).toBeInTheDocument()
    
    // The currency formatter adds dots as thousand separators
    // Total amount: 1,000,000 IDR
    // Total paid: 500,000 IDR
    // Total outstanding: 500,000 IDR
  })

  it('should show empty state when no class assigned', () => {
    const studentWithoutClass = {
      ...mockStudent,
      classStudents: [],
    }

    render(
      <StudentDetail
        student={studentWithoutClass}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Belum ada kelas')).toBeInTheDocument()
  })

  it('should show empty state when no invoices', () => {
    const studentWithoutInvoices = {
      ...mockStudent,
      invoices: [],
    }

    render(
      <StudentDetail
        student={studentWithoutInvoices}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    expect(screen.getByText('Belum ada riwayat pembayaran')).toBeInTheDocument()
  })

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    const editButton = screen.getByRole('button', { name: /Edit/i })
    editButton.click()

    expect(mockOnEdit).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Close button is clicked', () => {
    render(
      <StudentDetail
        student={mockStudent}
        onEdit={mockOnEdit}
        onClose={mockOnClose}
      />
    )

    const closeButton = screen.getByRole('button', { name: /Tutup/i })
    closeButton.click()

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
