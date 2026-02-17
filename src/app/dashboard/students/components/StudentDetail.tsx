'use client'

import { User, Mail, Phone, MapPin, Calendar, Users, CreditCard, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface StudentDetailProps {
  student: {
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
    enrollmentDate: Date
    isActive: boolean
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
        academicYear: {
          id: string
          name: string
        }
      }
    }>
    invoices: Array<{
      id: string
      invoiceNo: string
      month: number
      year: number
      amount: number
      status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
      dueDate: Date
      paidAt: Date | null
      paidAmount: number | null
    }>
  }
  onEdit: () => void
  onClose: () => void
}

export default function StudentDetail({ student, onEdit, onClose }: StudentDetailProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getMonthName = (month: number) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return months[month - 1]
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAID: { label: 'Lunas', className: 'bg-green-100 text-green-700' },
      PENDING: { label: 'Belum Bayar', className: 'bg-yellow-100 text-yellow-700' },
      OVERDUE: { label: 'Terlambat', className: 'bg-red-100 text-red-700' },
      CANCELLED: { label: 'Dibatalkan', className: 'bg-gray-100 text-gray-700' },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getCurrentClass = () => {
    if (student.classStudents.length === 0) {
      return <span className="text-gray-400">Belum ada kelas</span>
    }
    const classData = student.classStudents[0].class
    return (
      <div>
        <p className="font-medium text-gray-900">{classData.name}</p>
        <p className="text-sm text-gray-500">Kelas {classData.grade} - {classData.academicYear.name}</p>
      </div>
    )
  }

  const calculatePaymentSummary = () => {
    const totalAmount = student.invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const totalPaid = student.invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + (inv.paidAmount || 0), 0)
    const totalOutstanding = student.invoices
      .filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + inv.amount, 0)

    return { totalAmount, totalPaid, totalOutstanding }
  }

  const paymentSummary = calculatePaymentSummary()

  return (
    <div className="space-y-6">
      {/* Header with Photo and Basic Info */}
      <div className="flex items-start space-x-6 pb-6 border-b">
        <div className="flex-shrink-0">
          {student.photo ? (
            <img
              src={student.photo}
              alt={student.name}
              className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
            />
          ) : (
            <div
              className={`w-32 h-32 rounded-lg flex items-center justify-center ${
                student.gender === 'MALE' ? 'bg-primary-100' : 'bg-pink-100'
              }`}
            >
              <Users
                size={48}
                className={student.gender === 'MALE' ? 'text-primary-600' : 'text-pink-600'}
              />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{student.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">NIS:</span> {student.nis}
                </p>
                {student.nisn && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">NISN:</span> {student.nisn}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Jenis Kelamin:</span>{' '}
                  {student.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
                </p>
              </div>
            </div>
            <Button variant="primary" onClick={onEdit} className="flex items-center space-x-2">
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pribadi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Calendar className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
              <p className="font-medium text-gray-900">
                {student.placeOfBirth}, {formatDate(student.dateOfBirth)}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Tanggal Masuk</p>
              <p className="font-medium text-gray-900">{formatDate(student.enrollmentDate)}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="font-medium text-gray-900">{student.address}</p>
            </div>
          </div>
          {student.phone && (
            <div className="flex items-start space-x-3">
              <Phone className="text-gray-400 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-500">Nomor Telepon</p>
                <p className="font-medium text-gray-900">{student.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Parent Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Informasi Orang Tua</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <User className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Nama Ayah</p>
              <p className="font-medium text-gray-900">{student.parent.fatherName}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <User className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Nama Ibu</p>
              <p className="font-medium text-gray-900">{student.parent.motherName}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="font-medium text-gray-900">{student.parent.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="text-gray-400 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{student.parent.user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Class Assignment */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Kelas Saat Ini</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {getCurrentClass()}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Pembayaran</h4>
        
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="text-blue-600" size={20} />
              <p className="text-sm text-blue-600 font-medium">Total Tagihan</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(paymentSummary.totalAmount)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="text-green-600" size={20} />
              <p className="text-sm text-green-600 font-medium">Total Dibayar</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatCurrency(paymentSummary.totalPaid)}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="text-red-600" size={20} />
              <p className="text-sm text-red-600 font-medium">Total Tunggakan</p>
            </div>
            <p className="text-2xl font-bold text-red-900">{formatCurrency(paymentSummary.totalOutstanding)}</p>
          </div>
        </div>

        {/* Invoice List */}
        {student.invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">No. Invoice</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Periode</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jumlah</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {student.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{invoice.invoiceNo}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {getMonthName(invoice.month)} {invoice.year}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {invoice.paidAt ? formatDate(invoice.paidAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard size={48} className="mx-auto text-gray-300 mb-2" />
            <p>Belum ada riwayat pembayaran</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  )
}
