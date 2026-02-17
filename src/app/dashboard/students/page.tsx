import { getStudents, getClasses, getParents, getAllStudentsForExport } from './actions'
import StudentPageWrapper from './components/StudentPageWrapper'

interface SearchParams {
  page?: string
  search?: string
  classId?: string
  status?: 'active' | 'inactive' | 'all'
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  const classId = searchParams.classId || ''
  const status = searchParams.status || 'all'

  // Fetch students, classes, parents, and all students for export in parallel
  const [studentsData, classes, parents, allStudents] = await Promise.all([
    getStudents({ page, search, classId, status }),
    getClasses(),
    getParents(),
    getAllStudentsForExport({ search, classId, status }),
  ])

  return (
    <StudentPageWrapper
      initialStudents={studentsData.students}
      totalCount={studentsData.total}
      currentPage={studentsData.page}
      totalPages={studentsData.totalPages}
      classes={classes}
      parents={parents}
      allStudents={allStudents}
    />
  )
}
