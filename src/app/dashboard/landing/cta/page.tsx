import { requireRole } from '@/lib/auth-helpers';
import { getCTA } from '../actions';
import { CTAForm } from './components/CTAForm';

export const dynamic = 'force-dynamic';

export default async function CTAPage() {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  
  const cta = await getCTA();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CTA & Pendaftaran</h1>
        <p className="text-gray-600 mt-2">
          Kelola konten Call-to-Action dan keuntungan pendaftaran
        </p>
      </div>

      {cta && <CTAForm cta={cta} />}
    </div>
  );
}
