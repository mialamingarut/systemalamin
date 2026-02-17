'use client'

import { SPMBApplicant } from '@prisma/client'
import { Trophy, Medal, Award } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface RankingViewProps {
  applicants: SPMBApplicant[]
  passingThreshold?: number
}

export default function RankingView({ applicants, passingThreshold = 70 }: RankingViewProps) {
  // Sort by test score descending
  const rankedApplicants = [...applicants]
    .filter(a => a.testScore !== null)
    .sort((a, b) => (b.testScore || 0) - (a.testScore || 0))

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />
    if (rank === 2) return <Medal className="text-gray-400" size={24} />
    if (rank === 3) return <Award className="text-orange-500" size={24} />
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Peringkat Pendaftar</h3>
        <div className="text-sm text-gray-600">
          Batas Lulus: <span className="font-semibold text-primary-600">{passingThreshold}</span>
        </div>
      </div>

      {rankedApplicants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada pendaftar dengan nilai tes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankedApplicants.map((applicant, index) => {
            const rank = index + 1
            const isPassing = (applicant.testScore || 0) >= passingThreshold
            
            return (
              <div
                key={applicant.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  isPassing
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(rank) || (
                      <span className="text-2xl font-bold text-gray-400">#{rank}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{applicant.name}</p>
                    <p className="text-sm text-gray-600">{applicant.registrationNo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">
                    {applicant.testScore}
                  </p>
                  <p className={`text-sm font-medium ${
                    isPassing ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPassing ? 'LULUS' : 'TIDAK LULUS'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
