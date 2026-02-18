import Link from 'next/link';
import { Image as ImageIcon, Star, Award, MessageSquare, BookOpen } from 'lucide-react';

export default function LandingOverviewPage() {
  const sections = [
    {
      title: 'Hero & Statistik',
      description: 'Kelola headline, subheadline, dan statistik sekolah',
      href: '/dashboard/landing/hero',
      icon: Star,
      color: 'bg-blue-500',
    },
    {
      title: 'Tentang & Keunggulan',
      description: 'Kelola visi, misi, sejarah, dan keunggulan sekolah',
      href: '/dashboard/landing/about',
      icon: BookOpen,
      color: 'bg-indigo-500',
    },
    {
      title: 'Galeri Foto',
      description: 'Upload dan kelola foto-foto sekolah',
      href: '/dashboard/landing/gallery',
      icon: ImageIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Program Unggulan',
      description: 'Kelola program-program unggulan sekolah',
      href: '/dashboard/landing/programs',
      icon: Award,
      color: 'bg-purple-500',
    },
    {
      title: 'Testimoni',
      description: 'Kelola testimoni dari orang tua dan siswa',
      href: '/dashboard/landing/testimonials',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Landing Page CMS</h1>
        <p className="text-gray-600 mt-1">
          Kelola semua konten yang tampil di landing page sekolah
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`${section.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Perubahan akan langsung terlihat di landing page setelah disimpan</li>
          <li>• Gunakan foto berkualitas tinggi untuk hasil terbaik</li>
          <li>• Pastikan konten selalu up-to-date dan relevan</li>
        </ul>
      </div>
    </div>
  );
}
