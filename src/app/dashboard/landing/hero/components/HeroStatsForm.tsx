'use client';

import { useState } from 'react';
import { updateHero, updateStats } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

type Hero = {
  id: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string | null;
};

type Stats = {
  id: string;
  students: number;
  teachers: number;
  years: number;
};

export default function HeroStatsForm({ hero, stats }: { hero: Hero | null; stats: Stats | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Update Hero
      if (hero) {
        const heroData = {
          headline: formData.get('headline') as string,
          subheadline: formData.get('subheadline') as string,
          ctaPrimary: formData.get('ctaPrimary') as string,
          ctaSecondary: formData.get('ctaSecondary') as string,
        };
        await updateHero(hero.id, heroData);
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
    } catch (error) {
      toast.error('Gagal menyimpan perubahan');
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
