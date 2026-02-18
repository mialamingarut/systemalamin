import { getHero, getStats } from '../actions';
import HeroStatsForm from './components/HeroStatsForm';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
  const [hero, stats] = await Promise.all([getHero(), getStats()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hero & Statistik</h1>
        <p className="text-gray-600 mt-1">Kelola konten hero section dan statistik sekolah</p>
      </div>

      <HeroStatsForm hero={hero} stats={stats} />
    </div>
  );
}
