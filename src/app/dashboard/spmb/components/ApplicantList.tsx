'use client'

import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { SPMBApplicant } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import ApplicantCard from './ApplicantCard'
import ApplicantDetail from './ApplicantDetail'
import ScoreInput from './ScoreInput'
import { 
  getApplicantById, 
  verifyApplicant, 
  inputTestScore, 
  approveApplicant, 
  rejectApplicant 
} from '../actions'

type SPMBStatus = 'REGISTERED' | 'VERIFIED' | 'TESTED' | 'PASSED' | 'FAILED' | 'ENROLLED'

interface ApplicantListProps {
  initialApplicants: SPMBApplicant[]
}

export default function ApplicantList({ initialApplicants }: ApplicantListProps) {
  const router = useRouter()
  const toast = useToast()
  
  const [applicants, setApplicants] = useState(initialApplicants)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<SPMBStatus | 'ALL'>('ALL')
  const [filteredApplicants, setFilteredApplicants] = useState(initialApplicants)
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailApplicant, setDetailApplicant] = useState<SPMBApplicant | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  
  // Score input modal state
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false)
  const [scoreApplicant, setScoreApplicant] = useState<SPMBApplicant | null>(null)

  // Update applicants when initialApplicants changes
  useEffect(() => {
    setApplicants(initialApplicants)
  }, [initialApplicants])

  // Filter applicants based on search term and status
  useEffect(() => {
    let filtered = applicants

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchLower) ||
        a.registrationNo.toLowerCase().includes(searchLower) ||
        a.parentName.toLowerCase().includes(searchLower) ||
        a.parentPhone.includes(searchTerm)
      )
    }

    setFilteredApplicants(filtered)
  }, [searchTerm, statusFilter, applicants])

  const handleDetail = async (applicant: SPMBApplicant) => {
    setIsLoadingDetail(true)
    setIsDetailModalOpen(true)
    
    try {
      const fullApplicant = await getApplicantById(applicant.id)
      if (fullApplicant) {
        setDetailApplicant(fullApplicant)
      } else {
        toast.error('Gagal memuat detail pendaftar')
        setIsDetailModalOpen(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memuat detail')
      setIsDetailModalOpen(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleVerify = async (applicant: SPMBApplicant) => {
    try {
      const result = await verifyApplicant(applicant.id)
      
      if (result.success) {
        toast.success('Pendaftar berhasil diverifikasi')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal memverifikasi pendaftar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga')
    }
  }

  const handleInputScore = (applicant: SPMBApplicant) => {
    setScoreApplicant(applicant)
    setIsScoreModalOpen(true)
  }

  const handleScoreSubmit = async (score: number) => {
    if (!scoreApplicant) return

    try {
      const result = await inputTestScore(scoreApplicant.id, score)
      
      if (result.success) {
        toast.success('Nilai tes berhasil diinput')
        setIsScoreModalOpen(false)
        setScoreApplicant(null)
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menginput nilai tes')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga')
    }
  }

  const handleApprove = async (applicant: SPMBApplicant) => {
    try {
      const result = await approveApplicant(applicant.id)
      
      if (result.success) {
        toast.success('Pendaftar dinyatakan lulus')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menyetujui pendaftar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga')
    }
  }

  const handleReject = async (applicant: SPMBApplicant) => {
    const notes = prompt('Masukkan catatan penolakan (opsional):')
    
    try {
      const result = await rejectApplicant(applicant.id, notes || '')
      
      if (result.success) {
        toast.success('Pendaftar dinyatakan tidak lulus')
        router.refresh()
      } else {
        toast.error(result.error || 'Gagal menolak pendaftar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan yang tidak terduga')
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari pendaftar (nama, no. pendaftaran, orang tua)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SPMBStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="REGISTERED">Terdaftar</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="TESTED">Sudah Tes</option>
            <option value="PASSED">Lulus</option>
            <option value="FAILED">Tidak Lulus</option>
            <option value="ENROLLED">Terdaftar Siswa</option>
          </select>
        </div>

        {/* Applicant Grid */}
        {filteredApplicants.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-2">
              <Users size={48} className="text-gray-300" />
              <p className="text-lg font-medium">Tidak ada pendaftar ditemukan</p>
              <p className="text-sm">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Coba ubah filter atau kata kunci pencarian' 
                  : 'Belum ada data pendaftar'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onDetail={handleDetail}
                onVerify={handleVerify}
                onInputScore={handleInputScore}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {(searchTerm || statusFilter !== 'ALL') && (
          <p className="text-sm text-gray-600">
            Menampilkan {filteredApplicants.length} dari {applicants.length} pendaftar
          </p>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setDetailApplicant(null)
        }}
        title="Detail Pendaftar"
        size="xl"
      >
        {isLoadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : detailApplicant ? (
          <ApplicantDetail
            applicant={detailApplicant}
            onClose={() => {
              setIsDetailModalOpen(false)
              setDetailApplicant(null)
            }}
          />
        ) : null}
      </Modal>

      {/* Score Input Modal */}
      <Modal
        open={isScoreModalOpen}
        onClose={() => {
          setIsScoreModalOpen(false)
          setScoreApplicant(null)
        }}
        title="Input Nilai Tes"
        size="md"
      >
        {scoreApplicant && (
          <ScoreInput
            applicant={scoreApplicant}
            onSubmit={handleScoreSubmit}
            onCancel={() => {
              setIsScoreModalOpen(false)
              setScoreApplicant(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}
