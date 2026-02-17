import { requireRole } from '@/lib/auth-helpers';
import { SettingsPageWrapper } from './components/SettingsPageWrapper';

export default async function SettingsPage() {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  return <SettingsPageWrapper />;
}
