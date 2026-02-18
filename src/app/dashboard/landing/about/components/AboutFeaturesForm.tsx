'use client';

import { useState } from 'react';
import { updateAbout, updateFeature } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { BookOpen, Target, History, Award } from 'lucide-react';

type About = {
  id: string;
  title: string;
  description: string;
  vision: string;
  mission: string[];
  history: string;
};

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
};

export default function AboutFeaturesForm({
  about,
  features,
}: {
  about: About | null;
  features: Feature[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmitAbout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const missionText = formData.get('mission') as string;
      const mission = missionText.split('\n').map(m => m.trim()).filter(m => m.length > 0);

      if (about) {
        const data = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          vision: formData.get('vision') as string,
          mission,
          history: formData.get('history') as string,
        };

        await updateAbout(about.id, data);
        toast.success('Berhasil menyimpan perubahan');
      }
    } catch (error) {
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFeature = async (feature: Feature) => {
    try {
      await updateFeature(feature.id, { isActive: !feature.isActive });
      toast.success(feature.isActive ? 'Keunggulan disembunyikan' : 'Keunggulan ditampilkan');
      window.location.reload();
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  return (
    <div className="space-y-8">
      {/* About Section */}
      <form onSubmit={handleSubmitAbout} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Tentang Sekolah</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={about?.title}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Contoh: Tentang MI Al-Amin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Singkat <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            rows={3}
            defaultValue={about?.description}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Deskripsi singkat tentang sekolah"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <label className="block text-sm font-medium text-gray-700">
                Visi <span className="text-red-500">*</span>
              </label>
            </div>
            <textarea
              name="vision"
              required
              rows={4}
              defaultValue={about?.vision}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Visi sekolah"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-primary-600" />
              <label className="block text-sm font-medium text-gray-700">
                Misi <span className="text-red-500">*</span>
              </label>
            </div>
            <textarea
              name="mission"
              required
              rows={4}
              defaultValue={about?.mission.join('\n')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan satu misi per baris"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan setiap misi dengan enter (baris baru)</p>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <History className="w-5 h-5 text-primary-600" />
            <label className="block text-sm font-medium text-gray-700">
              Sejarah <span className="text-red-500">*</span>
            </label>
          </div>
          <textarea
            name="history"
            required
            rows={4}
            defaultValue={about?.history}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Sejarah singkat sekolah"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Keunggulan Sekolah</h2>
        <p className="text-sm text-gray-600 mb-6">
          Keunggulan ini ditampilkan di landing page. Anda bisa mengaktifkan/menonaktifkan tampilan.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`p-4 border rounded-lg ${
                feature.isActive ? 'border-primary-200 bg-primary-50/50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <button
                  onClick={() => handleToggleFeature(feature)}
                  className={`ml-4 px-3 py-1 rounded text-xs font-medium ${
                    feature.isActive
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {feature.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {features.length === 0 && (
          <p className="text-center text-gray-500 py-8">Belum ada keunggulan yang ditambahkan</p>
        )}
      </div>
    </div>
  );
}
