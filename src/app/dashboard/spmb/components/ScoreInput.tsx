'use client'

import { useState } from 'react'
import { SPMBApplicant } from '@prisma/client'

interface ScoreInputProps {
  applicant: SPMBApplicant
  onSubmit: (score: number) => void
  onCancel: () => void
}

export default function ScoreInput({ applicant, onSubmit, onCancel }: ScoreInputProps) {
  const [score, setScore] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const scoreNum = parseFloat(score)

    // Validation
    if (isNaN(scoreNum)) {
      setError('Nilai harus berupa angka')
      return
    }

    if (scoreNum < 0 || scoreNum > 100) {
      setError('Nilai harus antara 0 dan 100')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(scoreNum)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Applicant Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">Pendaftar</p>
        <p className="font-semibold text-gray-900">{applicant.name}</p>
        <p className="text-sm text-gray-600">{applicant.registrationNo}</p>
      </div>

      {/* Score Input */}
      <div>
        <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
          Nilai Tes <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="score"
          min="0"
          max="100"
          step="0.01"
          value={score}
          onChange={(e) => {
            setScore(e.target.value)
            setError('')
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Masukkan nilai (0-100)"
          disabled={isSubmitting}
          required
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        <p className="mt-1 text-sm text-gray-500">Masukkan nilai antara 0 dan 100</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan Nilai</span>
          )}
        </button>
      </div>
    </form>
  )
}
