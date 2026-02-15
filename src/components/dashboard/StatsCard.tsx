import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  amber: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
};

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          <div className="flex items-center space-x-1">
            <span
              className={`text-sm font-semibold ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </span>
            <span className="text-gray-500 text-sm">dari bulan lalu</span>
          </div>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}
