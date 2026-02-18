'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Star, User } from 'lucide-react';
import Image from 'next/image';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string | null;
  rating: number;
  order: number;
  isActive: boolean;
};

export default function TestimonialManager({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (editingTestimonial) {
        const result = await updateTestimonial(editingTestimonial.id, formData);
        if (result.success && result.data) {
          toast.success('Testimoni berhasil diupdate');
          setTestimonials(
            testimonials.map((t) => (t.id === editingTestimonial.id ? result.data as Testimonial : t))
          );
        } else {
          toast.error(result.error || 'Gagal update testimoni');
        }
      } else {
        const result = await createTestimonial(formData);
        if (result.success && result.data) {
          toast.success('Testimoni berhasil ditambahkan');
          setTestimonials([...testimonials, result.data as Testimonial]);
        } else {
          toast.error(result.error || 'Gagal menambahkan testimoni');
        }
      }

      setShowModal(false);
      setEditingTestimonial(null);
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return;

    try {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast.success('Testimoni berhasil dihapus');
        setTestimonials(testimonials.filter((t) => t.id !== id));
      } else {
        toast.error('Gagal menghapus testimoni');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Testimoni
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {testimonial.avatar ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setShowModal(true);
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 mt-3 line-clamp-3">{testimonial.content}</p>

                <div className="mt-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      testimonial.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {testimonial.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada testimoni. Tambahkan testimoni pertama Anda!</p>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTestimonial(null);
        }}
        title={editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={editingTestimonial?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Ibu Siti Aminah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peran/Status <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              required
              defaultValue={editingTestimonial?.role}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Orang Tua Siswa Kelas 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Testimoni <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={4}
              defaultValue={editingTestimonial?.content}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tulis testimoni di sini..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <select
              name="rating"
              required
              defaultValue={editingTestimonial?.rating || 5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
              <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
              <option value="3">⭐⭐⭐ (3 Bintang)</option>
              <option value="2">⭐⭐ (2 Bintang)</option>
              <option value="1">⭐ (1 Bintang)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Profil
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {editingTestimonial?.avatar && (
              <p className="text-xs text-gray-500 mt-1">
                Biarkan kosong jika tidak ingin mengubah foto
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingTestimonial(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : editingTestimonial ? 'Update' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
