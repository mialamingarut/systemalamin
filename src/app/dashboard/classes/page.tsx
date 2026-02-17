import { getClasses, getTeachersForDropdown } from './actions'
import ClassList from './components/ClassList'
import ClassPageHeader from './components/ClassPageHeader'

export default async function ClassesPage() {
  const [classes, teachers] = await Promise.all([
    getClasses(),
    getTeachersForDropdown(),
  ])

  return (
    <div className="space-y-6">
      <ClassPageHeader teachers={teachers} />

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <ClassList initialClasses={classes} teachers={teachers} />
      </div>
    </div>
  )
}
