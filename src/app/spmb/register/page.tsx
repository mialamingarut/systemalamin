'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SPMBRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    placeOfBirth: '',
    address: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    previousSchool: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit form
      alert('Pendaftaran berhasil! Nomor pendaftaran: SPMB-2026-001');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-4xl mb-2 text-primary-900">
              Formulir Pendaftaran
            </h1>
            <p className="text-gray-600">MI Al-Amin Tahun Ajaran 2026/2027</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      step > s ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Calon Siswa</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Kelamin *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="">Pilih</option>
                        <option value="MALE">Laki-laki</option>
                        <option value="FEMALE">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempat Lahir *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.placeOfBirth}
                        onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Orang Tua</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Orang Tua/Wali *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={formData.parentPhone}
                          onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asal Sekolah (TK/RA)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.previousSchool}
                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Dokumen</h2>
                  <div className="space-y-6">
                    {[
                      { label: 'Foto Calon Siswa', required: true },
                      { label: 'Akta Kelahiran', required: true },
                      { label: 'Kartu Keluarga', required: true },
                    ].map((doc, index) => (
                      <div key={index} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {doc.label} {doc.required && <span className="text-red-500">*</span>}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Format: JPG, PNG, PDF (Max 2MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          id={`file-${index}`}
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 transition-colors"
                        >
                          Pilih File
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-6 border-t">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Kembali
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {step === 3 ? 'Kirim Pendaftaran' : 'Lanjutkan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
