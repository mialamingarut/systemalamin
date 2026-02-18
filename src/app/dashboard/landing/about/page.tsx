import { getAbout, getFeatures } from '../actions';
import AboutFeaturesForm from './components/AboutFeaturesForm';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [about, features] = await Promise.all([getAbout(), getFeatures()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tentang & Keunggulan</h1>
        <p className="text-gray-600 mt-1">Kelola informasi tentang sekolah, visi, misi, dan keunggulan</p>
      </div>

      <AboutFeaturesForm about={about} features={features} />
    </div>
  );
}
