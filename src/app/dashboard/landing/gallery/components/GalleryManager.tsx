'use client';

import { useState } from 'react';
import { Upload, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../actions';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image: string;
  category: string | null;
  isActive: boolean;
  order: number;
};

export default function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const toast = useToast();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createGalleryItem(formData);

      if (result.success && result.data) {
        toast.success('Foto berhasil diupload');
        setItems([...items, result.data as GalleryItem]);
        setShowUploadModal(false);
        e.currentTarget.reset();
      } else {
        toast.error(result.error || 'Gagal upload foto');
      }
    } catch (error) {
      toast.error('Gagal upload foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
      };

      const result = await updateGalleryItem(selectedItem.id, data);

      if (result.success && result.data) {
        toast.success('Foto berhasil diupdate');
        setItems(items.map((item) => (item.id === selectedItem.id ? result.data as GalleryItem : item)));
        setShowEditModal(false);
        setSelectedItem(null);
      } else {
        toast.error('Gagal update foto');
      }
    } catch (error) {
      toast.error('Gagal update foto');
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    try {
      const result = await updateGalleryItem(item.id, { isActive: !item.isActive });

      if (result.success && result.data) {
        toast.success(item.isActive ? 'Foto disembunyikan' : 'Foto ditampilkan');
        setItems(items.map((i) => (i.id === item.id ? result.data as GalleryItem : i)));
      } else {
        toast.error('Gagal mengubah status');
      }
    } catch (error) {
      toast.error('Gagal mengubah status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
      const result = await deleteGalleryItem(id);

      if (result.success) {
        toast.success('Foto berhasil dihapus');
        setItems(items.filter((item) => item.id !== id));
      } else {
        toast.error('Gagal menghapus foto');
      }
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              {!item.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Disembunyikan</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <h3 className="font-medium text-sm text-gray-900 truncate">{item.title}</h3>
              {item.category && (
                <span className="text-xs text-gray-500">{item.category}</span>
              )}
            </div>

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              <button
                onClick={() => handleToggleActive(item)}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title={item.isActive ? 'Sembunyikan' : 'Tampilkan'}
              >
                {item.isActive ? (
                  <Eye className="w-4 h-4 text-gray-700" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-700" />
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setShowEditModal(true);
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada foto. Upload foto pertama Anda!</p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Foto Galeri"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Kegiatan Belajar Mengajar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Deskripsi singkat tentang foto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <input
              type="text"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contoh: Kegiatan, Fasilitas, Prestasi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Foto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, WebP. Maks 5MB</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isUploading}>
              {isUploading ? 'Mengupload...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        title="Edit Foto Galeri"
      >
        {selectedItem && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={selectedItem.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={selectedItem.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                name="category"
                defaultValue={selectedItem.category || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
