import { getTeachers } from './actions'
import TeacherList from './components/TeacherList'
import TeacherPageHeader from './components/TeacherPageHeader'

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <div className="space-y-6">
      <TeacherPageHeader />

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <TeacherList initialTeachers={teachers} />
      </div>
    </div>
  )
}
