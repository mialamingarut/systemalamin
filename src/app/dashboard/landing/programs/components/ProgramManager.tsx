'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { createProgram, updateProgram, deleteProgram } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type Program = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  features: string[];
  order: number;
  isActive: boolean;
};

export default function ProgramManager({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      if (editingProgram) {
        const result = await updateProgram(editingProgram.id, formData);
        if (result.success && result.data) {
          toast.success('Program berhasil diupdate');
          setPrograms(programs.map((p) => (p.id === editingProgram.id ? result.data as Program : p)));
        } else {
          toast.error(result.error || 'Gagal update program');
        }
      } else {
        const result = await createProgram(formData);
        if (result.success && result.data) {
          toast.success('Program berhasil ditambahkan');
          setPrograms([...programs, result.data as Program]);
        } else {
          toast.error(result.error || 'Gagal menambahkan program');
        }
      }

      setShowModal(false);
      setEditingProgram(null);
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus program ini?')) return;

    try {
      const result = await deleteProgram(id);
      if (result.success) {
        toast.success('Program berhasil dihapus');
        setPrograms(programs.filter((p) => p.id !== id));
      } else {
        toast.error('Gagal menghapus program');
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
          Tambah Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow overflow-hidden">
            {program.image ? (
              <div className="relative w-full h-48 bg-gray-100">
                <Image src={program.image} alt={program.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900">{program.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{program.description}</p>

              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Fitur:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {program.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                  {program.features.length > 3 && (
                    <li className="text-gray-500">+{program.features.length - 3} lainnya</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    program.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {program.isActive ? 'Aktif' : 'Nonaktif'}
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProgram(program);
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada program. Tambahkan program pertama Anda!</p>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProgram(null);
        }}
        title={editingProgram ? 'Edit Program' : 'Tambah Program'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={editingProgram?.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Tahfidz Quran"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={editingProgram?.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Deskripsi singkat tentang program"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fitur-fitur <span className="text-red-500">*</span>
            </label>
            <textarea
              name="features"
              required
              rows={4}
              defaultValue={editingProgram?.features.join('\n')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Masukkan satu fitur per baris&#10;Contoh:&#10;Target 2 Juz per tahun&#10;Metode Ummi&#10;Bimbingan intensif"
            />
            <p className="text-xs text-gray-500 mt-1">Pisahkan setiap fitur dengan enter (baris baru)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Program
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {editingProgram?.image && (
              <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setEditingProgram(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : editingProgram ? 'Update' : 'Tambah'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
