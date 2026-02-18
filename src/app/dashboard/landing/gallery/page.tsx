import { getGalleryItems } from '../actions';
import GalleryManager from './components/GalleryManager';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeri Landing Page</h1>
          <p className="text-gray-600 mt-1">Kelola foto-foto yang tampil di landing page</p>
        </div>
      </div>

      <GalleryManager initialItems={items} />
    </div>
  );
}
