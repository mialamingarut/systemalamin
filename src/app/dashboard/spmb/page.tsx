import { getApplicants } from './actions'
import SPMBPageHeader from './components/SPMBPageHeader'
import ApplicantList from './components/ApplicantList'

export default async function SPMBPage() {
  const applicants = await getApplicants()

  // Calculate stats
  const stats = {
    total: applicants.length,
    registered: applicants.filter(a => a.status === 'REGISTERED').length,
    verified: applicants.filter(a => a.status === 'VERIFIED').length,
    tested: applicants.filter(a => a.status === 'TESTED').length,
    passed: applicants.filter(a => a.status === 'PASSED').length,
    failed: applicants.filter(a => a.status === 'FAILED').length,
  }

  return (
    <div className="space-y-6">
      <SPMBPageHeader stats={stats} />
      
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <ApplicantList initialApplicants={applicants} />
      </div>
    </div>
  )
}
