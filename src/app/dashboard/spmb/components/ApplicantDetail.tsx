'use client'

import { SPMBApplicant } from '@prisma/client'
import { Calendar, MapPin, Phone, Mail, School, FileText, Image as ImageIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useState } from 'react'

type SPMBStatus = 'REGISTERED' | 'VERIFIED' | 'TESTED' | 'PASSED' | 'FAILED' | 'ENROLLED'

interface ApplicantDetailProps {
  applicant: SPMBApplicant
  onClose: () => void
}

export default function ApplicantDetail({ applicant, onClose }: ApplicantDetailProps) {
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)

  const statusConfig: Record<SPMBStatus, { label: string; color: string; bgColor: string }> = {
    REGISTERED: { label: 'Terdaftar', color: 'text-blue-700', bgColor: 'bg-blue-100' },
    VERIFIED: { label: 'Terverifikasi', color: 'text-green-700', bgColor: 'bg-green-100' },
    TESTED: { label: 'Sudah Tes', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    PASSED: { label: 'Lulus', color: 'text-primary-700', bgColor: 'bg-primary-100' },
    FAILED: { label: 'Tidak Lulus', color: 'text-red-700', bgColor: 'bg-red-100' },
    ENROLLED: { label: 'Terdaftar Siswa', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  }

  const statusInfo = statusConfig[applicant.status as SPMBStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {applicant.photo ? (
            <img
              src={applicant.photo}
              alt={applicant.name}
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
              onClick={() => setViewingDocument(applicant.photo!)}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-semibold text-2xl">
                {applicant.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{applicant.name}</h2>
            <p className="text-gray-600">{applicant.registrationNo}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Informasi Pribadi</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Calendar size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Tanggal Lahir</p>
              <p className="font-medium text-gray-900">
                {format(new Date(applicant.dateOfBirth), 'dd MMMM yyyy', { locale: id })}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Tempat Lahir</p>
              <p className="font-medium text-gray-900">{applicant.placeOfBirth}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Alamat</p>
              <p className="font-medium text-gray-900">{applicant.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <FileText size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Jenis Kelamin</p>
              <p className="font-medium text-gray-900">
                {applicant.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Informasi Orang Tua</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <FileText size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Nama Orang Tua</p>
              <p className="font-medium text-gray-900">{applicant.parentName}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Phone size={18} className="text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">No. Telepon</p>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900">{applicant.parentPhone}</p>
                <a
                  href={`https://wa.me/${applicant.parentPhone.replace(/^0/, '62').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                  title="Chat via WhatsApp"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          {applicant.parentEmail && (
            <div className="flex items-start space-x-2">
              <Mail size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{applicant.parentEmail}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* School Information */}
      {applicant.previousSchool && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Informasi Sekolah</h3>
          <div className="flex items-start space-x-2">
            <School size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Sekolah Asal</p>
              <p className="font-medium text-gray-900">{applicant.previousSchool}</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Score */}
      {applicant.testScore !== null && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Hasil Tes</h3>
          <div className="flex items-start space-x-2">
            <FileText size={18} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Nilai Tes</p>
              <p className="text-2xl font-bold text-primary-600">{applicant.testScore}</p>
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Dokumen</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {applicant.birthCertificate && (
            <button
              onClick={() => setViewingDocument(applicant.birthCertificate!)}
              className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-500 transition-colors"
            >
              <FileText size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-900">Akta Kelahiran</span>
            </button>
          )}
          {applicant.familyCard && (
            <button
              onClick={() => setViewingDocument(applicant.familyCard!)}
              className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-500 transition-colors"
            >
              <FileText size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-gray-900">Kartu Keluarga</span>
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {applicant.notes && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Catatan</h3>
          <p className="text-gray-700">{applicant.notes}</p>
        </div>
      )}

      {/* Registration Date */}
      <div className="text-sm text-gray-600">
        Terdaftar pada: {format(new Date(applicant.registeredAt), 'dd MMMM yyyy HH:mm', { locale: id })}
      </div>

      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Tutup
        </button>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setViewingDocument(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <img
              src={viewingDocument}
              alt="Document"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
