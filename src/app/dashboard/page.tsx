import { Users, GraduationCap, DollarSign, FileText } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivities from '@/components/dashboard/RecentActivities';
import PaymentChart from '@/components/dashboard/PaymentChart';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Siswa',
      value: '487',
      change: '+12',
      changeType: 'increase' as const,
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Total Guru',
      value: '28',
      change: '+2',
      changeType: 'increase' as const,
      icon: GraduationCap,
      color: 'green' as const,
    },
    {
      title: 'Pembayaran Bulan Ini',
      value: 'Rp 125jt',
      change: '+8%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'amber' as const,
    },
    {
      title: 'Pendaftar SPMB',
      value: '156',
      change: '+24',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang di AL-AMIN School Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentChart />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
