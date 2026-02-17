'use client'

import { SPMBApplicant } from '@prisma/client'
import { Calendar, MapPin, Phone, Mail, FileText, Eye, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface ApplicantCardProps {
  applicant: SPMBApplicant
  onDetail: (applicant: SPMBApplicant) => void
  onVerify?: (applicant: SPMBApplicant) => void
  onInputScore?: (applicant: SPMBApplicant) => void
  onApprove?: (applicant: SPMBApplicant) => void
  onReject?: (applicant: SPMBApplicant) => void
}

type SPMBStatus = 'REGISTERED' | 'VERIFIED' | 'TESTED' | 'PASSED' | 'FAILED' | 'ENROLLED'

const statusConfig: Record<SPMBStatus, { label: string; color: string; bgColor: string }> = {
  REGISTERED: { label: 'Terdaftar', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  VERIFIED: { label: 'Terverifikasi', color: 'text-green-700', bgColor: 'bg-green-100' },
  TESTED: { label: 'Sudah Tes', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  PASSED: { label: 'Lulus', color: 'text-primary-700', bgColor: 'bg-primary-100' },
  FAILED: { label: 'Tidak Lulus', color: 'text-red-700', bgColor: 'bg-red-100' },
  ENROLLED: { label: 'Terdaftar Siswa', color: 'text-gray-700', bgColor: 'bg-gray-100' },
}

export default function ApplicantCard({
  applicant,
  onDetail,
  onVerify,
  onInputScore,
  onApprove,
  onReject,
}: ApplicantCardProps) {
  const statusInfo = statusConfig[applicant.status as SPMBStatus]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {applicant.photo ? (
            <img
              src={applicant.photo}
              alt={applicant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-semibold text-lg">
                {applicant.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
            <p className="text-sm text-gray-500">{applicant.registrationNo}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          {format(new Date(applicant.dateOfBirth), 'dd MMMM yyyy', { locale: id })}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2" />
          {applicant.placeOfBirth}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone size={16} className="mr-2" />
          {applicant.parentPhone}
        </div>
        {applicant.parentEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail size={16} className="mr-2" />
            {applicant.parentEmail}
          </div>
        )}
        {applicant.testScore !== null && (
          <div className="flex items-center text-sm text-gray-600">
            <FileText size={16} className="mr-2" />
            Nilai Tes: <span className="font-semibold ml-1">{applicant.testScore}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onDetail(applicant)}
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye size={16} />
          <span>Detail</span>
        </button>

        {applicant.status === 'REGISTERED' && onVerify && (
          <button
            onClick={() => onVerify(applicant)}
            className="flex-1 px-3 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
          >
            <CheckCircle size={16} />
            <span>Verifikasi</span>
          </button>
        )}

        {applicant.status === 'VERIFIED' && onInputScore && (
          <button
            onClick={() => onInputScore(applicant)}
            className="flex-1 px-3 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
          >
            <FileText size={16} />
            <span>Input Nilai</span>
          </button>
        )}

        {applicant.status === 'TESTED' && onApprove && onReject && (
          <>
            <button
              onClick={() => onApprove(applicant)}
              className="flex-1 px-3 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-1"
            >
              <CheckCircle size={16} />
              <span>Lulus</span>
            </button>
            <button
              onClick={() => onReject(applicant)}
              className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
            >
              <XCircle size={16} />
              <span>Tolak</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
