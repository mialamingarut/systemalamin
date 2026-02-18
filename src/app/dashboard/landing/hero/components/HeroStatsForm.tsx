'use client';

import { useState } from 'react';
import { updateHero, updateStats } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

type Hero = {
  id: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string | null;
  heroImage: string | null;
};

type Stats = {
  id: string;
  students: number;
  teachers: number;
  years: number;
};

export default function HeroStatsForm({ hero, stats }: { hero: Hero | null; stats: Stats | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(hero?.heroImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Update Hero
      if (hero) {
        const heroFormData = new FormData();
        heroFormData.append('headline', formData.get('headline') as string);
        heroFormData.append('subheadline', formData.get('subheadline') as string);
        heroFormData.append('ctaPrimary', formData.get('ctaPrimary') as string);
        heroFormData.append('ctaSecondary', formData.get('ctaSecondary') as string);
        
        if (selectedFile) {
          heroFormData.append('file', selectedFile);
        }

        const result = await updateHero(hero.id, heroFormData);
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      // Update Stats
      if (stats) {
        const statsData = {
          students: parseInt(formData.get('students') as string),
          teachers: parseInt(formData.get('teachers') as string),
          years: parseInt(formData.get('years') as string),
        };
        await updateStats(stats.id, statsData);
      }

      toast.success('Berhasil menyimpan perubahan');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan perubahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Headline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="headline"
            required
            defaultValue={hero?.headline}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Contoh: Generasi Qurani Berprestasi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subheadline <span className="text-red-500">*</span>
          </label>
          <textarea
            name="subheadline"
            required
            rows={3}
            defaultValue={hero?.subheadline}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Deskripsi singkat tentang sekolah"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tombol Utama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ctaPrimary"
              required
              defaultValue={hero?.ctaPrimary}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Daftar Sekarang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tombol Sekunder
            </label>
            <input
              type="text"
              name="ctaSecondary"
              defaultValue={hero?.ctaSecondary || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Pelajari Lebih Lanjut"
            />
          </div>
        </div>

        {/* Hero Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Hero (Opsional)
          </label>
          
          {previewImage ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={previewImage}
                alt="Hero preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG atau WEBP (Max 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Gambar akan ditampilkan di sisi kanan hero section (desktop)
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Statistik Sekolah</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Siswa <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="students"
              required
              min="0"
              defaultValue={stats?.students}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Guru <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="teachers"
              required
              min="0"
              defaultValue={stats?.teachers}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahun Berdiri <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="years"
              required
              min="0"
              defaultValue={stats?.years}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Akan ditampilkan sebagai "X+ Tahun"</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
