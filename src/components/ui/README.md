# UI Components

This directory contains reusable UI components for the AL-AMIN School Management System.

## Components

### Modal
A modal dialog component with backdrop and escape key handling.

```tsx
import { Modal } from '@/components/ui'

<Modal 
  open={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md" // sm, md, lg, xl
>
  <p>Modal content goes here</p>
</Modal>
```

### Button
A button component with multiple variants and loading state.

```tsx
import { Button } from '@/components/ui'

<Button 
  variant="primary" // primary, secondary, danger, ghost
  size="md" // sm, md, lg
  loading={isLoading}
  onClick={handleClick}
>
  Click me
</Button>
```

### Input
A text input component with label and error display.

```tsx
import { Input } from '@/components/ui'

<Input
  label="Student Name"
  name="name"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={errors.name}
  required
  placeholder="Enter student name"
/>
```

### Select
A select dropdown component with label and error display.

```tsx
import { Select } from '@/components/ui'

<Select
  label="Gender"
  name="gender"
  value={value}
  onChange={(value) => setValue(value)}
  options={[
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' }
  ]}
  error={errors.gender}
  required
  placeholder="Select gender"
/>
```

### Table
A table component with pagination support.

```tsx
import { Table, ColumnDef } from '@/components/ui'

const columns: ColumnDef<Student>[] = [
  { key: 'nis', header: 'NIS' },
  { key: 'name', header: 'Name' },
  { 
    key: 'gender', 
    header: 'Gender',
    render: (value) => value === 'MALE' ? 'Male' : 'Female'
  }
]

<Table
  data={students}
  columns={columns}
  pagination={{
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => setPage(page)
  }}
  onRowClick={(student) => console.log(student)}
  loading={isLoading}
  emptyMessage="No students found"
/>
```

### Toast
A toast notification system with context provider.

```tsx
// In your component
import { useToast } from '@/components/ui'

function MyComponent() {
  const toast = useToast()
  
  const handleSuccess = () => {
    toast.success('Operation completed successfully')
  }
  
  const handleError = () => {
    toast.error('Something went wrong')
  }
  
  const handleInfo = () => {
    toast.info('Here is some information')
  }
  
  const handleWarning = () => {
    toast.warning('Please be careful')
  }
  
  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  )
}
```

Note: The `ToastProvider` is already included in the root layout, so you don't need to add it again.

## Testing

All components have unit tests. Run tests with:

```bash
npm test
```

## Styling

Components use Tailwind CSS for styling. The design follows a consistent color scheme:
- Primary: Blue (bg-blue-600)
- Danger: Red (bg-red-600)
- Success: Green (bg-green-600)
- Warning: Yellow (bg-yellow-600)
- Info: Blue (bg-blue-600)
