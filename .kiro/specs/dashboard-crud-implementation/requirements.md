# Requirements Document

## Introduction

This document specifies the requirements for implementing comprehensive CRUD (Create, Read, Update, Delete) functionality for the AL-AMIN School Management System dashboard. The system manages students, teachers, classes, new student registration (SPMB), finance, academic activities, and system settings. The implementation will transform static UI pages into fully functional modules with data persistence, validation, and user interactions.

## Glossary

- **System**: The AL-AMIN School Management System dashboard application
- **CRUD**: Create, Read, Update, Delete operations
- **Student_Module**: The students management subsystem
- **Teacher_Module**: The teachers management subsystem
- **Class_Module**: The classes management subsystem
- **SPMB_Module**: The new student registration and admission subsystem
- **Finance_Module**: The payment and invoice management subsystem
- **Academic_Module**: The academic calendar and announcements subsystem
- **Settings_Module**: The system configuration and administration subsystem
- **Server_Action**: Next.js server-side function for data operations
- **Soft_Delete**: Marking records as deleted without physical removal
- **Optimistic_Update**: UI update before server confirmation
- **Toast_Notification**: Temporary popup message for user feedback
- **Pagination**: Dividing data into pages for display
- **Filter**: Criteria-based data selection
- **Search**: Text-based data lookup
- **Validation**: Data integrity checking using Zod schema
- **Modal**: Overlay dialog for forms and confirmations
- **Invoice**: Monthly payment bill for students
- **SPP**: Monthly school fee (Sumbangan Pembinaan Pendidikan)
- **Academic_Year**: School year period with start and end dates
- **Registration_Number**: Unique identifier for SPMB applicants
- **NIS**: Student identification number (Nomor Induk Siswa)
- **NIP**: Teacher identification number (Nomor Induk Pegawai)

## Requirements


### Requirement 1: Student List Management

**User Story:** As a school administrator, I want to view and manage the list of students, so that I can access student information efficiently.

#### Acceptance Criteria

1. WHEN the students page loads, THE System SHALL fetch and display all active students with pagination
2. WHEN a user enters text in the search field, THE System SHALL filter students by name, NIS, or parent name
3. WHEN a user selects a class filter, THE System SHALL display only students in that class
4. WHEN a user selects a status filter, THE System SHALL display students matching that status (active/inactive)
5. WHEN displaying student data, THE System SHALL show NIS, name, photo, class, gender, parent name, and status
6. WHEN a user clicks pagination controls, THE System SHALL load the corresponding page of results
7. THE System SHALL display 20 students per page by default
8. WHEN no students match the filters, THE System SHALL display an appropriate empty state message

### Requirement 2: Student Creation

**User Story:** As a school administrator, I want to add new students to the system, so that I can maintain accurate enrollment records.

#### Acceptance Criteria

1. WHEN a user clicks the "Add Student" button, THE System SHALL display a student creation form in a modal
2. THE System SHALL validate that NIS is unique before creating a student
3. WHEN a user submits the form with valid data, THE System SHALL create a new student record
4. WHEN a user submits the form with invalid data, THE System SHALL display field-specific error messages
5. THE System SHALL require these fields: NIS, name, gender, date of birth, place of birth, address, parent selection, enrollment date
6. THE System SHALL allow optional fields: NISN, phone, photo
7. WHEN a student is created successfully, THE System SHALL display a success toast notification
8. WHEN a student is created successfully, THE System SHALL close the modal and refresh the student list
9. WHEN student creation fails, THE System SHALL display an error toast notification with details


### Requirement 3: Student Update

**User Story:** As a school administrator, I want to edit student information, so that I can keep student records current.

#### Acceptance Criteria

1. WHEN a user clicks the "Edit" button for a student, THE System SHALL display a pre-filled edit form in a modal
2. THE System SHALL validate that NIS remains unique when changed
3. WHEN a user submits the form with valid changes, THE System SHALL update the student record
4. WHEN a user submits the form with invalid data, THE System SHALL display field-specific error messages
5. WHEN a student is updated successfully, THE System SHALL display a success toast notification
6. WHEN a student is updated successfully, THE System SHALL close the modal and refresh the student list with optimistic updates
7. WHEN student update fails, THE System SHALL display an error toast notification and revert optimistic changes

### Requirement 4: Student Deletion

**User Story:** As a school administrator, I want to delete student records, so that I can remove students who are no longer enrolled.

#### Acceptance Criteria

1. WHEN a user clicks the "Delete" button for a student, THE System SHALL display a confirmation dialog
2. WHEN a user confirms deletion, THE System SHALL perform a soft delete by setting deletedAt timestamp
3. WHEN a student is deleted successfully, THE System SHALL display a success toast notification
4. WHEN a student is deleted successfully, THE System SHALL remove the student from the list with optimistic updates
5. WHEN student deletion fails, THE System SHALL display an error toast notification and revert optimistic changes
6. THE System SHALL prevent deletion of students with unpaid invoices

### Requirement 5: Student Detail View

**User Story:** As a school administrator, I want to view detailed student information, so that I can access complete student profiles.

#### Acceptance Criteria

1. WHEN a user clicks the "Detail" button for a student, THE System SHALL display a detailed view modal
2. THE System SHALL display all student fields including personal information, parent details, and enrollment data
3. THE System SHALL display the student's current class assignment
4. THE System SHALL display the student's payment history
5. THE System SHALL provide navigation to edit mode from the detail view


### Requirement 6: Student Import from Excel

**User Story:** As a school administrator, I want to import multiple students from an Excel file, so that I can efficiently add bulk student data.

#### Acceptance Criteria

1. WHEN a user clicks the "Import" button, THE System SHALL display a file upload dialog
2. THE System SHALL accept Excel files in .xlsx and .xls formats
3. WHEN a user uploads a file, THE System SHALL validate the file structure against the expected template
4. THE System SHALL validate each row for required fields and data types
5. WHEN validation passes, THE System SHALL create student records for all valid rows
6. WHEN validation fails, THE System SHALL display a detailed error report with row numbers and issues
7. WHEN import completes successfully, THE System SHALL display a summary of imported records
8. THE System SHALL skip rows with duplicate NIS values and report them

### Requirement 7: Student Export to Excel and PDF

**User Story:** As a school administrator, I want to export student data to Excel and PDF formats, so that I can generate reports and share data.

#### Acceptance Criteria

1. WHEN a user clicks the "Export" button, THE System SHALL display format options (Excel, PDF)
2. WHEN a user selects Excel format, THE System SHALL generate an .xlsx file with all filtered students
3. WHEN a user selects PDF format, THE System SHALL generate a formatted PDF with all filtered students
4. THE System SHALL include all visible columns in the export
5. THE System SHALL apply current filters and search criteria to the export
6. WHEN export completes, THE System SHALL trigger a file download
7. THE System SHALL include export timestamp in the filename

### Requirement 8: Teacher List Management

**User Story:** As a school administrator, I want to view and manage the list of teachers, so that I can access teacher information efficiently.

#### Acceptance Criteria

1. WHEN the teachers page loads, THE System SHALL fetch and display all active teachers
2. WHEN a user enters text in the search field, THE System SHALL filter teachers by name, NIP, or subjects
3. WHEN displaying teacher data, THE System SHALL show NIP, name, photo, subjects, phone, and join date
4. THE System SHALL display teachers in a card grid layout
5. WHEN no teachers match the search, THE System SHALL display an appropriate empty state message


### Requirement 9: Teacher Creation

**User Story:** As a school administrator, I want to add new teachers to the system, so that I can maintain accurate staff records.

#### Acceptance Criteria

1. WHEN a user clicks the "Add Teacher" button, THE System SHALL display a teacher creation form in a modal
2. THE System SHALL validate that NIP is unique before creating a teacher
3. THE System SHALL validate that email is unique before creating a teacher
4. WHEN a user submits the form with valid data, THE System SHALL create both User and Teacher records
5. THE System SHALL require these fields: name, email, password, NIP, phone, address, date of birth, gender, join date
6. THE System SHALL allow optional fields: subjects (multi-select), avatar
7. THE System SHALL set the user role to TEACHER automatically
8. WHEN a teacher is created successfully, THE System SHALL display a success toast notification
9. WHEN teacher creation fails, THE System SHALL display an error toast notification with details

### Requirement 10: Teacher Update

**User Story:** As a school administrator, I want to edit teacher information, so that I can keep teacher records current.

#### Acceptance Criteria

1. WHEN a user clicks the "Edit" button for a teacher, THE System SHALL display a pre-filled edit form in a modal
2. THE System SHALL validate that NIP remains unique when changed
3. THE System SHALL validate that email remains unique when changed
4. WHEN a user submits the form with valid changes, THE System SHALL update both User and Teacher records
5. WHEN a teacher is updated successfully, THE System SHALL display a success toast notification
6. WHEN teacher update fails, THE System SHALL display an error toast notification

### Requirement 11: Teacher Deletion

**User Story:** As a school administrator, I want to delete teacher records, so that I can remove teachers who are no longer employed.

#### Acceptance Criteria

1. WHEN a user clicks the "Delete" button for a teacher, THE System SHALL display a confirmation dialog
2. WHEN a user confirms deletion, THE System SHALL perform a soft delete by setting deletedAt timestamp
3. THE System SHALL prevent deletion of teachers assigned to active classes
4. WHEN a teacher is deleted successfully, THE System SHALL display a success toast notification
5. WHEN teacher deletion fails, THE System SHALL display an error toast notification


### Requirement 12: Teacher Detail View and Subject Assignment

**User Story:** As a school administrator, I want to view teacher details and assign subjects, so that I can manage teacher responsibilities.

#### Acceptance Criteria

1. WHEN a user clicks the "Detail" button for a teacher, THE System SHALL display a detailed view modal
2. THE System SHALL display all teacher fields including personal information and assigned subjects
3. THE System SHALL display the teacher's assigned classes
4. THE System SHALL provide an interface to add or remove subjects
5. WHEN subjects are modified, THE System SHALL update the teacher record immediately

### Requirement 13: Class List Management

**User Story:** As a school administrator, I want to view and manage classes, so that I can organize students and teachers.

#### Acceptance Criteria

1. WHEN the classes page loads, THE System SHALL fetch and display all classes for the active academic year
2. WHEN displaying class data, THE System SHALL show class name, grade, teacher name, student count, and capacity
3. THE System SHALL allow filtering by grade level
4. THE System SHALL display classes in a card or table layout
5. WHEN no classes exist, THE System SHALL display an appropriate empty state message

### Requirement 14: Class Creation

**User Story:** As a school administrator, I want to create new classes, so that I can organize students by grade and section.

#### Acceptance Criteria

1. WHEN a user clicks the "Add Class" button, THE System SHALL display a class creation form in a modal
2. THE System SHALL validate that class name is unique within the academic year
3. THE System SHALL require these fields: name, grade (1-6), teacher selection, capacity
4. THE System SHALL automatically associate the class with the active academic year
5. WHEN a class is created successfully, THE System SHALL display a success toast notification
6. WHEN class creation fails, THE System SHALL display an error toast notification


### Requirement 15: Class Update and Teacher Assignment

**User Story:** As a school administrator, I want to edit class information and assign teachers, so that I can maintain accurate class records.

#### Acceptance Criteria

1. WHEN a user clicks the "Edit" button for a class, THE System SHALL display a pre-filled edit form in a modal
2. THE System SHALL validate that class name remains unique within the academic year when changed
3. THE System SHALL allow changing the assigned teacher
4. WHEN a class is updated successfully, THE System SHALL display a success toast notification
5. WHEN class update fails, THE System SHALL display an error toast notification

### Requirement 16: Class Deletion

**User Story:** As a school administrator, I want to delete classes, so that I can remove classes that are no longer needed.

#### Acceptance Criteria

1. WHEN a user clicks the "Delete" button for a class, THE System SHALL display a confirmation dialog
2. WHEN a user confirms deletion, THE System SHALL perform a soft delete by setting deletedAt timestamp
3. THE System SHALL prevent deletion of classes with assigned students
4. WHEN a class is deleted successfully, THE System SHALL display a success toast notification
5. WHEN class deletion fails, THE System SHALL display an error toast notification

### Requirement 17: Class Roster Management

**User Story:** As a school administrator, I want to assign students to classes, so that I can organize class rosters.

#### Acceptance Criteria

1. WHEN a user clicks the "View Roster" button for a class, THE System SHALL display the class roster modal
2. THE System SHALL display all students currently assigned to the class
3. THE System SHALL provide an interface to add students to the class
4. THE System SHALL provide an interface to remove students from the class
5. THE System SHALL prevent adding students who are already in another class for the same academic year
6. THE System SHALL prevent exceeding the class capacity when adding students
7. WHEN roster changes are saved, THE System SHALL update ClassStudent records
8. WHEN roster update succeeds, THE System SHALL display a success toast notification


### Requirement 18: SPMB Applicant List Management

**User Story:** As a school administrator, I want to view and manage new student applicants, so that I can process registrations efficiently.

#### Acceptance Criteria

1. WHEN the SPMB page loads, THE System SHALL fetch and display all applicants for the active academic year
2. WHEN a user selects a status filter, THE System SHALL display applicants matching that status
3. WHEN displaying applicant data, THE System SHALL show registration number, name, gender, parent contact, test score, and status
4. THE System SHALL display applicants in chronological order by registration date
5. WHEN no applicants match the filter, THE System SHALL display an appropriate empty state message

### Requirement 19: SPMB Applicant Detail and Verification

**User Story:** As a school administrator, I want to view applicant details and verify their data, so that I can process applications accurately.

#### Acceptance Criteria

1. WHEN a user clicks the "Detail" button for an applicant, THE System SHALL display a detailed view modal
2. THE System SHALL display all applicant fields including personal information, parent details, and uploaded documents
3. THE System SHALL provide buttons to view uploaded documents (photo, birth certificate, family card)
4. WHEN a user clicks the "Verify" button, THE System SHALL update the applicant status to VERIFIED
5. WHEN verification succeeds, THE System SHALL display a success toast notification

### Requirement 20: SPMB Test Score Input

**User Story:** As a school administrator, I want to input test scores for applicants, so that I can evaluate candidates.

#### Acceptance Criteria

1. WHEN a user clicks the "Input Score" button for a verified applicant, THE System SHALL display a score input form
2. THE System SHALL validate that the score is a number between 0 and 100
3. WHEN a user submits a valid score, THE System SHALL update the applicant record and set status to TESTED
4. WHEN score input succeeds, THE System SHALL display a success toast notification
5. WHEN score input fails, THE System SHALL display an error toast notification


### Requirement 21: SPMB Ranking Generation

**User Story:** As a school administrator, I want to generate rankings based on test scores, so that I can identify top candidates.

#### Acceptance Criteria

1. WHEN a user clicks the "Generate Ranking" button, THE System SHALL sort all TESTED applicants by test score in descending order
2. THE System SHALL display the ranking list with position numbers
3. THE System SHALL highlight applicants above a configurable passing score threshold
4. THE System SHALL provide an export option for the ranking list

### Requirement 22: SPMB Applicant Approval and Rejection

**User Story:** As a school administrator, I want to approve or reject applicants, so that I can finalize admissions.

#### Acceptance Criteria

1. WHEN a user clicks the "Approve" button for a tested applicant, THE System SHALL update the applicant status to PASSED
2. WHEN a user clicks the "Reject" button for a tested applicant, THE System SHALL update the applicant status to FAILED
3. WHEN approval or rejection succeeds, THE System SHALL display a success toast notification
4. THE System SHALL allow adding notes when rejecting an applicant
5. THE System SHALL send email notifications to parents when status changes to PASSED or FAILED

### Requirement 23: SPMB Registration Form Printing

**User Story:** As a school administrator, I want to print registration forms, so that I can provide physical documentation.

#### Acceptance Criteria

1. WHEN a user clicks the "Print Form" button for an applicant, THE System SHALL generate a formatted PDF registration form
2. THE System SHALL include all applicant information in the PDF
3. THE System SHALL include uploaded photos in the PDF
4. WHEN PDF generation completes, THE System SHALL trigger a file download or open print dialog


### Requirement 24: Invoice Generation

**User Story:** As a school administrator, I want to generate monthly invoices for all students, so that I can bill families for tuition.

#### Acceptance Criteria

1. WHEN a user clicks the "Generate Invoices" button, THE System SHALL display a month and year selection form
2. WHEN a user confirms generation, THE System SHALL create invoice records for all active students
3. THE System SHALL generate unique invoice numbers in the format INV-YYYYMM-XXXX
4. THE System SHALL set the invoice amount from the SystemConfig SPP value
5. THE System SHALL set the due date to the 10th of the selected month
6. THE System SHALL skip students who already have an invoice for that month and year
7. WHEN generation completes, THE System SHALL display a summary of created invoices
8. WHEN generation fails, THE System SHALL display an error toast notification

### Requirement 25: Payment Recording

**User Story:** As a school administrator, I want to record payments for invoices, so that I can track which students have paid.

#### Acceptance Criteria

1. WHEN a user clicks the "Pay" button for a pending invoice, THE System SHALL display a payment recording form
2. THE System SHALL require payment amount and payment date
3. WHEN a user submits the payment form, THE System SHALL update the invoice status to PAID
4. THE System SHALL set the paidAt timestamp to the provided payment date
5. THE System SHALL set the paidAmount to the provided amount
6. WHEN payment recording succeeds, THE System SHALL display a success toast notification
7. WHEN payment recording fails, THE System SHALL display an error toast notification
8. THE System SHALL allow partial payments by keeping status as PENDING if paidAmount is less than amount

### Requirement 26: Payment History View

**User Story:** As a school administrator, I want to view payment history for students, so that I can track payment patterns.

#### Acceptance Criteria

1. WHEN a user views a student's detail page, THE System SHALL display all invoices for that student
2. THE System SHALL display invoice number, month, year, amount, status, and payment date
3. THE System SHALL calculate and display total paid and total outstanding amounts
4. THE System SHALL allow filtering by payment status and year


### Requirement 27: Financial Reports Generation

**User Story:** As a school administrator, I want to generate financial reports, so that I can analyze revenue and payment trends.

#### Acceptance Criteria

1. WHEN a user clicks the "Generate Report" button, THE System SHALL display report options (monthly, yearly, by class)
2. WHEN a user selects monthly report, THE System SHALL generate statistics for the selected month
3. THE System SHALL calculate total invoices, total paid, total pending, and payment rate
4. THE System SHALL display payment status breakdown by count and amount
5. THE System SHALL provide export options for the report (Excel, PDF)
6. WHEN report generation completes, THE System SHALL display the report data

### Requirement 28: Financial Data Export

**User Story:** As a school administrator, I want to export financial data, so that I can perform external analysis.

#### Acceptance Criteria

1. WHEN a user clicks the "Export" button on the finance page, THE System SHALL display format options (Excel, PDF)
2. WHEN a user selects Excel format, THE System SHALL generate an .xlsx file with all filtered invoices
3. WHEN a user selects PDF format, THE System SHALL generate a formatted PDF with all filtered invoices
4. THE System SHALL include invoice number, student name, month, year, amount, status, and payment date
5. THE System SHALL apply current filters to the export
6. WHEN export completes, THE System SHALL trigger a file download

### Requirement 29: Academic Calendar Management

**User Story:** As a school administrator, I want to manage the academic calendar, so that I can schedule school events.

#### Acceptance Criteria

1. WHEN the academic page loads, THE System SHALL display the current academic year calendar
2. THE System SHALL display events in a calendar view with dates and descriptions
3. WHEN a user clicks "Add Event" button, THE System SHALL display an event creation form
4. THE System SHALL require event title, date, and description
5. WHEN an event is created successfully, THE System SHALL display a success toast notification
6. THE System SHALL allow editing and deleting calendar events
7. WHEN event operations succeed, THE System SHALL update the calendar view


### Requirement 30: Announcement Management

**User Story:** As a school administrator, I want to create and manage announcements, so that I can communicate with the school community.

#### Acceptance Criteria

1. WHEN the academic page loads, THE System SHALL display all announcements ordered by publish date
2. WHEN a user clicks "Create Announcement" button, THE System SHALL display an announcement creation form
3. THE System SHALL require title and content fields
4. THE System SHALL allow optional fields: academic year association, pinned status
5. WHEN an announcement is created successfully, THE System SHALL display a success toast notification
6. THE System SHALL allow editing and deleting announcements
7. WHEN a user pins an announcement, THE System SHALL display it at the top of the list
8. WHEN announcement operations succeed, THE System SHALL update the announcement list

### Requirement 31: School Activity Management

**User Story:** As a school administrator, I want to manage school activities with photos, so that I can document school events.

#### Acceptance Criteria

1. WHEN the academic page loads, THE System SHALL display all activities ordered by date
2. WHEN a user clicks "Add Activity" button, THE System SHALL display an activity creation form
3. THE System SHALL require title, description, and date fields
4. THE System SHALL allow optional fields: location, photos (multiple upload)
5. WHEN photos are uploaded, THE System SHALL validate file types (jpg, png, webp) and size (max 5MB each)
6. WHEN an activity is created successfully, THE System SHALL display a success toast notification
7. THE System SHALL allow editing and deleting activities
8. WHEN viewing an activity, THE System SHALL display all uploaded photos in a gallery

### Requirement 32: Academic Year Management

**User Story:** As a school administrator, I want to manage academic years, so that I can organize data by school year.

#### Acceptance Criteria

1. WHEN the settings page loads, THE System SHALL display all academic years
2. WHEN a user clicks "Add Academic Year" button, THE System SHALL display a creation form
3. THE System SHALL require name, start date, and end date fields
4. THE System SHALL validate that name is unique
5. THE System SHALL validate that start date is before end date
6. THE System SHALL allow setting one academic year as active
7. WHEN an academic year is set as active, THE System SHALL deactivate all other academic years
8. WHEN academic year operations succeed, THE System SHALL display a success toast notification


### Requirement 33: System Configuration Management

**User Story:** As a school administrator, I want to manage system configuration, so that I can customize system behavior.

#### Acceptance Criteria

1. WHEN the settings page loads, THE System SHALL display all configuration key-value pairs
2. THE System SHALL display school information settings (name, address, phone, email)
3. THE System SHALL display financial settings (SPP amount, late fee)
4. WHEN a user clicks "Edit" for a configuration, THE System SHALL display an edit form
5. WHEN a user updates a configuration, THE System SHALL validate the value format
6. WHEN configuration update succeeds, THE System SHALL display a success toast notification
7. THE System SHALL apply configuration changes immediately to relevant modules

### Requirement 34: User Management

**User Story:** As a super administrator, I want to manage system users, so that I can control access to the system.

#### Acceptance Criteria

1. WHEN the settings page loads, THE System SHALL display all users with their roles
2. WHEN a user clicks "Add User" button, THE System SHALL display a user creation form
3. THE System SHALL require email, password, name, and role fields
4. THE System SHALL validate that email is unique
5. THE System SHALL hash passwords before storing
6. WHEN a user is created successfully, THE System SHALL display a success toast notification
7. THE System SHALL allow editing user information except password
8. THE System SHALL provide a separate password reset function
9. THE System SHALL allow deactivating users without deletion

### Requirement 35: Activity Log Viewing

**User Story:** As a super administrator, I want to view activity logs, so that I can audit system usage.

#### Acceptance Criteria

1. WHEN the settings page loads, THE System SHALL display recent activity logs
2. THE System SHALL display user name, action, entity, timestamp, and IP address
3. THE System SHALL allow filtering by user, action type, entity type, and date range
4. THE System SHALL display logs in reverse chronological order
5. THE System SHALL paginate logs with 50 entries per page
6. THE System SHALL allow exporting logs to CSV format


### Requirement 36: Form Validation

**User Story:** As a system user, I want forms to validate my input, so that I can correct errors before submission.

#### Acceptance Criteria

1. THE System SHALL validate all form inputs using Zod schemas
2. WHEN a user enters invalid data, THE System SHALL display field-specific error messages below the input
3. THE System SHALL validate email format for email fields
4. THE System SHALL validate phone number format for phone fields
5. THE System SHALL validate date formats and ranges for date fields
6. THE System SHALL validate numeric ranges for number fields
7. THE System SHALL prevent form submission when validation errors exist
8. THE System SHALL clear error messages when the user corrects the input

### Requirement 37: Loading States

**User Story:** As a system user, I want to see loading indicators, so that I know the system is processing my request.

#### Acceptance Criteria

1. WHEN a data fetch operation is in progress, THE System SHALL display a loading spinner or skeleton
2. WHEN a form submission is in progress, THE System SHALL disable the submit button and show a loading indicator
3. WHEN a file upload is in progress, THE System SHALL display an upload progress indicator
4. THE System SHALL prevent duplicate submissions during loading states
5. WHEN an operation completes, THE System SHALL remove loading indicators

### Requirement 38: Error Handling

**User Story:** As a system user, I want clear error messages, so that I can understand what went wrong.

#### Acceptance Criteria

1. WHEN a server error occurs, THE System SHALL display a user-friendly error message
2. WHEN a network error occurs, THE System SHALL display a connectivity error message
3. WHEN a validation error occurs, THE System SHALL display specific field errors
4. WHEN a permission error occurs, THE System SHALL display an access denied message
5. THE System SHALL log detailed error information for debugging
6. THE System SHALL provide retry options for transient errors


### Requirement 39: Responsive Design

**User Story:** As a system user, I want the dashboard to work on different screen sizes, so that I can access it from any device.

#### Acceptance Criteria

1. THE System SHALL display properly on desktop screens (1920px and above)
2. THE System SHALL display properly on laptop screens (1024px to 1919px)
3. THE System SHALL display properly on tablet screens (768px to 1023px)
4. THE System SHALL display properly on mobile screens (below 768px)
5. WHEN on mobile, THE System SHALL collapse the sidebar into a hamburger menu
6. WHEN on mobile, THE System SHALL stack form fields vertically
7. WHEN on mobile, THE System SHALL make tables horizontally scrollable
8. THE System SHALL maintain usability across all screen sizes

### Requirement 40: Optimistic UI Updates

**User Story:** As a system user, I want immediate feedback when I perform actions, so that the interface feels responsive.

#### Acceptance Criteria

1. WHEN a user creates a record, THE System SHALL immediately add it to the list before server confirmation
2. WHEN a user updates a record, THE System SHALL immediately reflect changes before server confirmation
3. WHEN a user deletes a record, THE System SHALL immediately remove it from the list before server confirmation
4. WHEN a server operation fails, THE System SHALL revert the optimistic update
5. WHEN a server operation fails, THE System SHALL display an error notification
6. THE System SHALL maintain data consistency between optimistic updates and server state

### Requirement 41: Activity Logging

**User Story:** As a system administrator, I want all user actions to be logged, so that I can track system usage and changes.

#### Acceptance Criteria

1. WHEN a user creates a record, THE System SHALL log the action with entity type, entity ID, and user ID
2. WHEN a user updates a record, THE System SHALL log the action with changed fields
3. WHEN a user deletes a record, THE System SHALL log the action with entity details
4. THE System SHALL capture IP address and user agent for each logged action
5. THE System SHALL log authentication events (login, logout, failed attempts)
6. THE System SHALL store logs in the ActivityLog table
7. THE System SHALL not log read operations to avoid excessive log volume
