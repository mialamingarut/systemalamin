import { getPrograms } from '../actions';
import ProgramManager from './components/ProgramManager';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Unggulan</h1>
          <p className="text-gray-600 mt-1">Kelola program-program unggulan sekolah</p>
        </div>
      </div>

      <ProgramManager initialPrograms={programs} />
    </div>
  );
}
