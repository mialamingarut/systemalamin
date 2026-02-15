import { Clock } from 'lucide-react';

export default function RecentActivities() {
  const activities = [
    { user: 'Admin', action: 'Menambahkan siswa baru', time: '5 menit lalu', color: 'blue' },
    { user: 'Guru Ahmad', action: 'Mengupdate nilai siswa', time: '15 menit lalu', color: 'green' },
    { user: 'Admin', action: 'Verifikasi pembayaran SPP', time: '1 jam lalu', color: 'amber' },
    { user: 'Kepala Sekolah', action: 'Membuat pengumuman', time: '2 jam lalu', color: 'purple' },
    { user: 'Admin', action: 'Export data siswa', time: '3 jam lalu', color: 'blue' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Aktivitas Terbaru</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[activity.color]}`}>
              <Clock size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
