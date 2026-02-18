import { getTestimonials } from '../actions';
import TestimonialManager from './components/TestimonialManager';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimoni</h1>
          <p className="text-gray-600 mt-1">Kelola testimoni dari orang tua dan siswa</p>
        </div>
      </div>

      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
