# Manual Integration Testing Checklist
## AL-AMIN School Management System

**Purpose:** Verify all modules work correctly through complete user flows
**Tester:** _______________
**Date:** _______________
**Environment:** Development / Staging / Production

---

## Pre-Testing Setup

- [ ] Database seeded with test data
- [ ] Application running on localhost:3000
- [ ] Browser: Chrome/Firefox/Safari/Edge
- [ ] Clear browser cache and cookies
- [ ] Test user accounts created for each role

---

## 1. Authentication & Authorization

### Login Flow
- [ ] Navigate to `/login`
- [ ] Login with valid credentials
- [ ] Verify redirect to dashboard
- [ ] Verify user name displayed in header
- [ ] Logout successfully
- [ ] Verify redirect to login page

### Invalid Login
- [ ] Try login with invalid email
- [ ] Try login with invalid password
- [ ] Verify error messages displayed
- [ ] Verify no access to protected routes

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 2. Student Module Testing

### 2.1 Student List & Search
- [ ] Navigate to `/dashboard/students`
- [ ] Verify student list loads
- [ ] Verify pagination works (next/previous)
- [ ] Search by student name
- [ ] Verify search results correct
- [ ] Filter by class
- [ ] Filter by status (ACTIVE/INACTIVE)
- [ ] Clear filters and verify reset

### 2.2 Create Student
- [ ] Click "Tambah Siswa" button
- [ ] Fill all required fields
- [ ] Select parent from dropdown
- [ ] Upload student photo (optional)
- [ ] Submit form
- [ ] Verify success toast
- [ ] Verify student appears in list
- [ ] Verify student data correct

### 2.3 Update Student
- [ ] Click edit on a student
- [ ] Modify student name
- [ ] Modify student address
- [ ] Change student class
- [ ] Submit form
- [ ] Verify success toast
- [ ] Verify changes reflected in list
- [ ] Verify changes in detail view

### 2.4 View Student Detail
- [ ] Click on a student card/row
- [ ] Verify modal opens
- [ ] Verify all student info displayed
- [ ] Verify parent info displayed
- [ ] Verify class info displayed
- [ ] Verify payment history displayed
- [ ] Close modal

### 2.5 Delete Student
- [ ] Click delete on a student (without unpaid invoices)
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify success toast
- [ ] Verify student removed from list (soft delete)
- [ ] Try to delete student with unpaid invoices
- [ ] Verify error message about unpaid invoices

### 2.6 Import Students
- [ ] Click "Import" button
- [ ] Download template file
- [ ] Verify template structure
- [ ] Upload valid Excel file
- [ ] Verify import summary
- [ ] Verify imported students in list
- [ ] Upload invalid file format
- [ ] Verify error message
- [ ] Upload file with duplicate NIS
- [ ] Verify error report

### 2.7 Export Students
- [ ] Click "Export" button
- [ ] Export to Excel
- [ ] Verify file downloads
- [ ] Open file and verify data
- [ ] Export to PDF
- [ ] Verify PDF downloads
- [ ] Open PDF and verify formatting

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 3. Teacher Module Testing

### 3.1 Teacher List & Search
- [ ] Navigate to `/dashboard/teachers`
- [ ] Verify teacher cards load
- [ ] Search by teacher name
- [ ] Verify search results
- [ ] Verify teacher info displayed (NIP, subjects)

### 3.2 Create Teacher
- [ ] Click "Tambah Guru" button
- [ ] Fill all required fields
- [ ] Enter valid email
- [ ] Enter valid phone number
- [ ] Set password (min 8 characters)
- [ ] Select subjects (multi-select)
- [ ] Submit form
- [ ] Verify success toast
- [ ] Verify teacher appears in list
- [ ] Verify user account created

### 3.3 Update Teacher
- [ ] Click edit on a teacher
- [ ] Modify teacher info
- [ ] Change subjects
- [ ] Submit form
- [ ] Verify success toast
- [ ] Verify changes reflected

### 3.4 View Teacher Detail
- [ ] Click on a teacher card
- [ ] Verify modal opens
- [ ] Verify all teacher info
- [ ] Verify assigned classes
- [ ] Verify subjects list
- [ ] Close modal

### 3.5 Delete Teacher
- [ ] Try to delete teacher with active classes
- [ ] Verify error message
- [ ] Delete teacher without active classes
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify success toast

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 4. Class Module Testing

### 4.1 Class List & Filter
- [ ] Navigate to `/dashboard/classes`
- [ ] Verify class cards load
- [ ] Filter by grade (1-6)
- [ ] Verify filter results
- [ ] Verify class info (teacher, student count, capacity)

### 4.2 Create Class
- [ ] Click "Tambah Kelas" button
- [ ] Enter class name
- [ ] Select grade (1-6)
- [ ] Select teacher
- [ ] Set capacity (1-50)
- [ ] Submit form
- [ ] Verify success toast
- [ ] Verify class appears in list

### 4.3 Update Class
- [ ] Click edit on a class
- [ ] Modify class name
- [ ] Change teacher
- [ ] Change capacity
- [ ] Submit form
- [ ] Verify success toast

### 4.4 Class Roster Management
- [ ] Click "Kelola Siswa" on a class
- [ ] Verify current students displayed
- [ ] Search for available students
- [ ] Add student to class
- [ ] Verify student added
- [ ] Try to add student beyond capacity
- [ ] Verify capacity error
- [ ] Remove student from class
- [ ] Verify student removed
- [ ] Try to assign student to multiple classes in same year
- [ ] Verify error message

### 4.5 Delete Class
- [ ] Try to delete class with assigned students
- [ ] Verify error message
- [ ] Delete class without students
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify success toast

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 5. SPMB Module Testing

### 5.1 Applicant List & Filter
- [ ] Navigate to `/dashboard/spmb`
- [ ] Verify applicant list loads
- [ ] Filter by status (REGISTERED, VERIFIED, TESTED, APPROVED, REJECTED)
- [ ] Verify filter results
- [ ] Verify status badges displayed

### 5.2 View Applicant Detail
- [ ] Click on an applicant
- [ ] Verify modal opens
- [ ] Verify all applicant info
- [ ] Verify uploaded documents
- [ ] View document (if available)
- [ ] Close modal

### 5.3 Verify Applicant
- [ ] Click "Verifikasi" on REGISTERED applicant
- [ ] Verify confirmation dialog
- [ ] Confirm verification
- [ ] Verify status changed to VERIFIED
- [ ] Verify success toast

### 5.4 Input Test Score
- [ ] Click "Input Nilai" on VERIFIED applicant
- [ ] Enter test score (0-100)
- [ ] Submit score
- [ ] Verify status changed to TESTED
- [ ] Verify success toast
- [ ] Try to enter invalid score (>100)
- [ ] Verify validation error

### 5.5 Generate Ranking
- [ ] Click "Generate Ranking" button
- [ ] Verify ranking list displayed
- [ ] Verify sorted by test score (descending)
- [ ] Verify passing threshold highlighted

### 5.6 Approve/Reject Applicant
- [ ] Click "Terima" on TESTED applicant
- [ ] Verify confirmation dialog
- [ ] Confirm approval
- [ ] Verify status changed to APPROVED
- [ ] Verify success toast
- [ ] Click "Tolak" on TESTED applicant
- [ ] Enter rejection notes
- [ ] Confirm rejection
- [ ] Verify status changed to REJECTED

### 5.7 Print Registration Form
- [ ] Click "Cetak Formulir" on applicant
- [ ] Verify PDF generates
- [ ] Verify PDF contains all applicant info
- [ ] Verify photo included (if available)

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 6. Finance Module Testing

### 6.1 Invoice Generation
- [ ] Navigate to `/dashboard/finance`
- [ ] Click "Generate Tagihan" button
- [ ] Select month and year
- [ ] Click generate
- [ ] Verify generation summary
- [ ] Verify invoice count
- [ ] Verify invoices appear in list
- [ ] Try to generate for same month/year again
- [ ] Verify duplicate prevention

### 6.2 Invoice List & Filter
- [ ] Verify invoice list loads
- [ ] Filter by status (PENDING, PAID, CANCELLED)
- [ ] Filter by month
- [ ] Filter by year
- [ ] Verify filter results
- [ ] Verify invoice details (number, amount, due date, status)

### 6.3 Record Payment
- [ ] Click "Bayar" on PENDING invoice
- [ ] Enter payment amount (full)
- [ ] Enter payment date
- [ ] Add notes (optional)
- [ ] Submit payment
- [ ] Verify status changed to PAID
- [ ] Verify success toast
- [ ] Record partial payment
- [ ] Verify status remains PENDING
- [ ] Verify remaining amount updated

### 6.4 Cancel Invoice
- [ ] Click "Batalkan" on PENDING invoice
- [ ] Enter cancellation reason
- [ ] Confirm cancellation
- [ ] Verify status changed to CANCELLED
- [ ] Verify success toast

### 6.5 Financial Reports
- [ ] View financial statistics
- [ ] Verify total invoices count
- [ ] Verify total paid amount
- [ ] Verify total pending amount
- [ ] Verify payment rate percentage
- [ ] Verify charts displayed correctly

### 6.6 Export Financial Data
- [ ] Click "Export" button
- [ ] Export to Excel
- [ ] Verify file downloads
- [ ] Open file and verify data
- [ ] Export to PDF
- [ ] Verify PDF downloads

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 7. Academic Module Testing

### 7.1 Calendar Events
- [ ] Navigate to `/dashboard/academic`
- [ ] Switch to "Kalender" tab
- [ ] Verify calendar view loads
- [ ] Click "Tambah Event" button
- [ ] Enter event title
- [ ] Select event date
- [ ] Enter description
- [ ] Select academic year
- [ ] Submit form
- [ ] Verify event appears in calendar
- [ ] Click on event to view details
- [ ] Edit event
- [ ] Verify changes saved
- [ ] Delete event
- [ ] Verify event removed

### 7.2 Announcements
- [ ] Switch to "Pengumuman" tab
- [ ] Verify announcement list loads
- [ ] Click "Tambah Pengumuman" button
- [ ] Enter title
- [ ] Enter content
- [ ] Toggle "Pin" option
- [ ] Select academic year (optional)
- [ ] Submit form
- [ ] Verify announcement appears in list
- [ ] Verify pinned announcements at top
- [ ] Edit announcement
- [ ] Verify changes saved
- [ ] Delete announcement
- [ ] Verify announcement removed

### 7.3 School Activities
- [ ] Switch to "Kegiatan" tab
- [ ] Verify activity list loads
- [ ] Click "Tambah Kegiatan" button
- [ ] Enter activity title
- [ ] Enter description
- [ ] Select date
- [ ] Enter location (optional)
- [ ] Add photo URLs
- [ ] Submit form
- [ ] Verify activity appears in list
- [ ] Click "Lihat Galeri" on activity
- [ ] Verify photo gallery opens
- [ ] Verify photos displayed
- [ ] Edit activity
- [ ] Delete activity

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 8. Settings Module Testing

### 8.1 Academic Year Management
- [ ] Navigate to `/dashboard/settings`
- [ ] Switch to "Tahun Ajaran" view
- [ ] Verify academic year list loads
- [ ] Click "Tambah Tahun Ajaran" button
- [ ] Enter year name (e.g., "2026/2027")
- [ ] Select start date
- [ ] Select end date (must be after start)
- [ ] Toggle "Active" status
- [ ] Submit form
- [ ] Verify year appears in list
- [ ] Try to create duplicate year name
- [ ] Verify error message
- [ ] Try to set multiple years as active
- [ ] Verify only one active year allowed
- [ ] Edit academic year
- [ ] Delete academic year

### 8.2 System Configuration
- [ ] Switch to "Konfigurasi" view
- [ ] Verify config list loads
- [ ] Verify configs grouped by category
- [ ] Click edit on a config
- [ ] Modify config value
- [ ] Save changes
- [ ] Verify success toast
- [ ] Verify changes applied immediately

### 8.3 User Management
- [ ] Switch to "Pengguna" view
- [ ] Verify user list loads
- [ ] Click "Tambah User" button
- [ ] Enter email (must be unique)
- [ ] Enter name
- [ ] Enter password (min 8 characters)
- [ ] Select role
- [ ] Submit form
- [ ] Verify user appears in list
- [ ] Try to create user with duplicate email
- [ ] Verify error message
- [ ] Edit user info
- [ ] Reset user password
- [ ] Enter new password
- [ ] Verify success toast
- [ ] Delete user
- [ ] Verify confirmation dialog

### 8.4 Activity Log Viewer
- [ ] Switch to "Activity Log" view
- [ ] Verify log list loads
- [ ] Filter by user
- [ ] Filter by action type (CREATE, UPDATE, DELETE)
- [ ] Filter by entity type
- [ ] Filter by date range
- [ ] Verify filter results
- [ ] Verify pagination works
- [ ] Export logs to CSV
- [ ] Verify file downloads
- [ ] Open file and verify data

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 9. Cross-Module Integration Testing

### 9.1 Student → Class → Teacher Flow
- [ ] Create a new student
- [ ] Create a new class with teacher
- [ ] Assign student to class
- [ ] Verify student shows in class roster
- [ ] Verify class shows in student detail
- [ ] Verify teacher shows in class detail
- [ ] Remove student from class
- [ ] Verify student removed from roster

### 9.2 Student → Invoice → Payment Flow
- [ ] Create a new student
- [ ] Generate invoices for current month
- [ ] Verify invoice created for new student
- [ ] Record payment for invoice
- [ ] Verify invoice status updated
- [ ] View student detail
- [ ] Verify payment history displayed

### 9.3 SPMB → Student Flow
- [ ] Create SPMB applicant (via public form)
- [ ] Verify applicant in SPMB list
- [ ] Verify → Test → Approve applicant
- [ ] Convert approved applicant to student
- [ ] Verify student created
- [ ] Verify student appears in student list

### 9.4 Teacher → Class → Student Flow
- [ ] Create a new teacher
- [ ] Assign teacher to class
- [ ] Add students to class
- [ ] View teacher detail
- [ ] Verify assigned classes displayed
- [ ] Try to delete teacher with active classes
- [ ] Verify error message

### 9.5 Academic Year → Class → Student Flow
- [ ] Create new academic year
- [ ] Set as active
- [ ] Create class for new year
- [ ] Assign students to class
- [ ] Verify single class assignment per year
- [ ] Try to assign student to multiple classes in same year
- [ ] Verify error message

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 10. Error Scenarios & Edge Cases

### 10.1 Validation Errors
- [ ] Submit form with empty required fields
- [ ] Verify field-specific error messages
- [ ] Enter invalid email format
- [ ] Verify email validation error
- [ ] Enter invalid phone format
- [ ] Verify phone validation error
- [ ] Enter date range with end before start
- [ ] Verify date validation error

### 10.2 Business Rule Violations
- [ ] Try to delete student with unpaid invoices
- [ ] Verify error message
- [ ] Try to delete teacher with active classes
- [ ] Verify error message
- [ ] Try to delete class with assigned students
- [ ] Verify error message
- [ ] Try to exceed class capacity
- [ ] Verify capacity error

### 10.3 Duplicate Prevention
- [ ] Try to create student with duplicate NIS
- [ ] Verify uniqueness error
- [ ] Try to create teacher with duplicate NIP
- [ ] Verify uniqueness error
- [ ] Try to create teacher with duplicate email
- [ ] Verify uniqueness error
- [ ] Try to create class with duplicate name in same year
- [ ] Verify uniqueness error

### 10.4 Network Errors
- [ ] Disconnect network
- [ ] Try to submit form
- [ ] Verify network error message
- [ ] Reconnect network
- [ ] Retry operation
- [ ] Verify success

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 11. Responsive Design Testing

### 11.1 Desktop (1920px+)
- [ ] Test all pages on large desktop
- [ ] Verify layouts use full width
- [ ] Verify multi-column grids (3-4 columns)
- [ ] Verify tables show all columns
- [ ] Verify modals are appropriately sized

### 11.2 Laptop (1024px-1919px)
- [ ] Test all pages on laptop
- [ ] Verify layouts adjust appropriately
- [ ] Verify 2-3 column grids
- [ ] Verify tables remain readable
- [ ] Verify modals fit screen

### 11.3 Tablet (768px-1023px)
- [ ] Test all pages on tablet
- [ ] Verify sidebar collapsible
- [ ] Verify 2 column grids
- [ ] Verify tables scrollable horizontally
- [ ] Verify forms stack vertically

### 11.4 Mobile (<768px)
- [ ] Test all pages on mobile
- [ ] Verify hamburger menu works
- [ ] Verify single column layout
- [ ] Verify tables scroll horizontally
- [ ] Verify forms fully stacked
- [ ] Verify modals full-screen
- [ ] Verify touch interactions work

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 12. Performance Testing

### 12.1 Page Load Times
- [ ] Measure dashboard load time
- [ ] Measure student list load time (with 100+ students)
- [ ] Measure teacher list load time
- [ ] Measure class list load time
- [ ] Verify all pages load < 3 seconds

### 12.2 Search & Filter Performance
- [ ] Search with 1000+ students
- [ ] Verify search results < 1 second
- [ ] Apply multiple filters
- [ ] Verify filter results < 1 second

### 12.3 Large Data Operations
- [ ] Import 100+ students via Excel
- [ ] Verify import completes successfully
- [ ] Export 1000+ records to Excel
- [ ] Verify export completes successfully
- [ ] Generate 500+ invoices
- [ ] Verify generation completes successfully

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 13. Browser Compatibility

### Chrome
- [ ] Test all critical flows
- [ ] Verify UI renders correctly
- [ ] Verify all features work

### Firefox
- [ ] Test all critical flows
- [ ] Verify UI renders correctly
- [ ] Verify all features work

### Safari
- [ ] Test all critical flows
- [ ] Verify UI renders correctly
- [ ] Verify all features work

### Edge
- [ ] Test all critical flows
- [ ] Verify UI renders correctly
- [ ] Verify all features work

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## 14. Accessibility Testing

### Keyboard Navigation
- [ ] Navigate entire app using only keyboard
- [ ] Verify Tab key moves focus correctly
- [ ] Verify Enter key activates buttons
- [ ] Verify Escape key closes modals
- [ ] Verify focus indicators visible

### Screen Reader
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify all content readable
- [ ] Verify form labels announced
- [ ] Verify error messages announced
- [ ] Verify button purposes clear

### Color Contrast
- [ ] Verify text readable on backgrounds
- [ ] Verify buttons have sufficient contrast
- [ ] Verify error messages visible
- [ ] Verify status badges distinguishable

**Notes:**
```
_________________________________________________
_________________________________________________
```

---

## Summary

### Total Test Cases: ~300+

### Pass/Fail Summary:
- Passed: _____ / _____
- Failed: _____ / _____
- Blocked: _____ / _____
- Skipped: _____ / _____

### Critical Issues Found:
```
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________
```

### Minor Issues Found:
```
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________
```

### Recommendations:
```
_________________________________________________
_________________________________________________
_________________________________________________
```

### Overall Assessment:
- [ ] Ready for Production
- [ ] Needs Minor Fixes
- [ ] Needs Major Fixes
- [ ] Not Ready

---

**Tester Signature:** _______________
**Date Completed:** _______________
**Next Review Date:** _______________

---

Last Updated: 2026-02-15
Version: 1.0
