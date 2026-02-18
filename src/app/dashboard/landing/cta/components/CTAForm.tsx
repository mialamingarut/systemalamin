'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { updateCTA } from '../../actions';
import { Plus, X } from 'lucide-react';

type CTAFormProps = {
  cta: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
  };
};

export function CTAForm({ cta }: CTAFormProps) {
  const [formData, setFormData] = useState({
    title: cta.title,
    subtitle: cta.subtitle,
    description: cta.description,
    benefits: cta.benefits,
  });
  const [newBenefit, setNewBenefit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()],
      });
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateCTA(cta.id, formData);
    setIsLoading(false);

    if (result.success) {
      toast.success('CTA berhasil diupdate');
    } else {
      toast.error(result.error || 'Gagal mengupdate CTA');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle (Badge)
        </label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Pendaftaran Dibuka"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Judul Utama
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Daftarkan Putra-Putri Anda Sekarang!"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Bergabunglah dengan keluarga besar MI Al-Amin..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keuntungan Mendaftar
        </label>
        
        {/* Existing Benefits */}
        <div className="space-y-2 mb-4">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <span className="flex-1 text-sm">{benefit}</span>
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Benefit */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Tambah keuntungan baru..."
          />
          <button
            type="button"
            onClick={handleAddBenefit}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
