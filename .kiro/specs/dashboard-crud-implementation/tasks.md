# Implementation Plan: Dashboard CRUD Implementation

## Overview

This implementation plan breaks down the comprehensive CRUD functionality for the AL-AMIN School Management System into discrete, incremental tasks. The implementation follows a module-by-module approach, starting with foundational components and utilities, then implementing each module (Students, Teachers, Classes, SPMB, Finance, Academic, Settings) with their respective CRUD operations, validation, and testing.

Each task builds on previous work, ensuring that code is integrated and functional at every step. Property-based tests are included as optional sub-tasks to validate correctness properties, while core implementation tasks remain required.

## Tasks

- [x] 1. Set up core infrastructure and shared components
  - Create reusable UI components (Modal, Toast, Button, Input, Select, Table)
  - Set up Zod validation schemas in `src/lib/validations.ts`
  - Create utility functions for exports in `src/lib/exports.ts`
  - Set up toast notification system with context provider
  - Create activity logging utility function
  - Configure Vitest for testing
  - Install and configure fast-check for property-based testing
  - _Requirements: 36.1, 37.1, 38.1_

- [ ] 2. Implement Student Module - Core CRUD
  - [x] 2.1 Create student list page with server-side data fetching
    - Implement `getStudents` server action with pagination, search, and filters
    - Create StudentList client component with table display
    - Add search input with debouncing
    - Add filter dropdowns for class and status
    - Implement pagination controls
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7_
  
  - [ ]* 2.2 Write property tests for student filtering and pagination
    - **Property 1: Search filter correctness**
    - **Property 2: Class filter correctness**
    - **Property 3: Status filter correctness**
    - **Property 4: Pagination correctness**
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.6**
  
  - [x] 2.3 Create student form component with validation
    - Build StudentForm component with all required and optional fields
    - Implement Zod validation with error display
    - Add parent selection dropdown
    - Add photo upload functionality
    - Handle form submission with optimistic updates
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 2.4 Write property tests for student creation validation
    - **Property 5: Uniqueness constraint enforcement (NIS)**
    - **Property 6: Required field validation**
    - **Property 7: Optional field acceptance**
    - **Property 8: Successful creation persistence**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6**


  - [x] 2.5 Implement student update and delete operations
    - Create `updateStudent` server action with validation
    - Create `deleteStudent` server action with soft delete
    - Add business rule check for unpaid invoices before deletion
    - Implement optimistic UI updates for edit and delete
    - Add confirmation dialog for deletion
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.6_
  
  - [ ]* 2.6 Write property tests for student update and delete
    - **Property 9: Soft delete behavior**
    - **Property 11: Deletion constraint enforcement (unpaid invoices)**
    - **Validates: Requirements 4.2, 4.6**
  
  - [x] 2.7 Create student detail view component
    - Build StudentDetail modal component
    - Display all student information including relations
    - Show current class assignment
    - Show payment history
    - Add navigation to edit mode
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3. Implement Student Module - Import/Export
  - [x] 3.1 Create Excel import functionality
    - Create file upload API route for handling Excel files
    - Implement `importStudents` server action
    - Validate file format (.xlsx, .xls)
    - Validate file structure against template
    - Validate each row for required fields and data types
    - Handle duplicate NIS values
    - Generate detailed error report
    - Display import summary
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.8_
  
  - [ ]* 3.2 Write property tests for student import
    - **Property 18: File format validation**
    - **Property 19: Import structure validation**
    - **Property 20: Import row validation**
    - **Property 21: Import duplicate handling**
    - **Property 22: Import success count**
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5, 6.6, 6.8**
  
  - [x] 3.3 Create Excel and PDF export functionality
    - Implement `exportStudents` server action for Excel format
    - Implement PDF generation with jspdf
    - Apply current filters to export
    - Include all visible columns
    - Generate filename with timestamp
    - Trigger file download
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 3.4 Write property tests for student export
    - **Property 23: Export data consistency**
    - **Property 24: Export field completeness**
    - **Property 25: Export filename timestamp**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5, 7.7**

- [x] 4. Checkpoint - Student Module Complete
  - Ensure all student CRUD operations work correctly
  - Verify import/export functionality
  - Test search, filter, and pagination
  - Ask the user if questions arise


- [ ] 5. Implement Teacher Module - Core CRUD
  - [x] 5.1 Create teacher list page with search
    - Implement `getTeachers` server action with search
    - Create TeacherCard component for card grid display
    - Add search input with debouncing
    - Display teacher information with subjects
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 5.2 Create teacher form component with user creation
    - Build TeacherForm component with all required fields
    - Implement validation for NIP and email uniqueness
    - Handle password hashing for new users
    - Create both User and Teacher records in transaction
    - Set user role to TEACHER automatically
    - Add multi-select for subjects
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ]* 5.3 Write property tests for teacher creation
    - **Property 5: Uniqueness constraint enforcement (NIP, email)**
    - **Property 10: Related record creation**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.7**
  
  - [x] 5.4 Implement teacher update and delete operations
    - Create `updateTeacher` server action
    - Create `deleteTeacher` server action with soft delete
    - Add business rule check for active classes before deletion
    - Update both User and Teacher records
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3_
  
  - [ ]* 5.5 Write property tests for teacher deletion constraints
    - **Property 11: Deletion constraint enforcement (active classes)**
    - **Validates: Requirements 11.3**
  
  - [x] 5.6 Create teacher detail view and subject assignment
    - Build TeacherDetail modal component
    - Display all teacher information
    - Show assigned classes
    - Create SubjectAssignment component
    - Implement `updateTeacherSubjects` server action
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 6. Implement Class Module - Core CRUD
  - [x] 6.1 Create class list page with filtering
    - Implement `getClasses` server action
    - Create ClassList component with card or table layout
    - Add grade filter dropdown
    - Display class information with teacher and student count
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 6.2 Create class form component
    - Build ClassForm component
    - Validate class name uniqueness within academic year
    - Add teacher selection dropdown
    - Add capacity input with validation
    - Associate with active academic year automatically
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ]* 6.3 Write property tests for class validation
    - **Property 5: Uniqueness constraint enforcement (class name + academic year)**
    - **Validates: Requirements 14.2**


  - [x] 6.4 Implement class update and delete operations
    - Create `updateClass` server action
    - Create `deleteClass` server action with soft delete
    - Add business rule check for assigned students before deletion
    - _Requirements: 15.1, 15.2, 15.3, 16.1, 16.2, 16.3_
  
  - [ ]* 6.5 Write property tests for class deletion constraints
    - **Property 11: Deletion constraint enforcement (assigned students)**
    - **Validates: Requirements 16.3**
  
  - [x] 6.6 Create class roster management component
    - Build ClassRoster modal component
    - Display current students in the class
    - Create interface to add students (multi-select or search)
    - Create interface to remove students
    - Implement `updateClassRoster` server action
    - Validate single class assignment per academic year
    - Enforce capacity limits
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_
  
  - [ ]* 6.7 Write property tests for class roster constraints
    - **Property 12: Class capacity enforcement**
    - **Property 13: Single class assignment per academic year**
    - **Validates: Requirements 17.5, 17.6**

- [x] 7. Checkpoint - Teacher and Class Modules Complete
  - Ensure all teacher CRUD operations work correctly
  - Verify subject assignment functionality
  - Ensure all class CRUD operations work correctly
  - Verify class roster management
  - Ask the user if questions arise

- [x] 8. Implement SPMB Module - Applicant Management
  - [x] 8.1 Create SPMB applicant list page
    - Implement `getApplicants` server action with status filter
    - Create ApplicantList component
    - Add status filter dropdown
    - Display applicant information with status badges
    - Show action buttons based on status
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  
  - [x] 8.2 Create applicant detail and verification
    - Build ApplicantDetail modal component
    - Display all applicant information
    - Show uploaded documents with view buttons
    - Implement `verifyApplicant` server action
    - Add verify button that updates status to VERIFIED
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [x] 8.3 Implement test score input
    - Create ScoreInput form component
    - Validate score range (0-100)
    - Implement `inputTestScore` server action
    - Update status to TESTED after score input
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [ ]* 8.4 Write property tests for score validation
    - **Property 14: Score range validation**
    - **Validates: Requirements 20.2**


  - [x] 8.5 Create ranking generation and approval system
    - Implement `generateRanking` server action
    - Create RankingView component
    - Sort applicants by test score
    - Highlight passing candidates based on threshold
    - Implement `approveApplicant` server action
    - Implement `rejectApplicant` server action with notes
    - Add email notification for status changes
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 22.1, 22.2, 22.3, 22.4, 22.5_
  
  - [x] 8.6 Create registration form printing
    - Implement PDF generation for registration forms
    - Include all applicant information
    - Include uploaded photos
    - Trigger download or print dialog
    - _Requirements: 23.1, 23.2, 23.3, 23.4_

- [x] 9. Implement Finance Module - Invoice and Payment Management
  - [x] 9.1 Create invoice generation functionality
    - Build InvoiceGenerator component with month/year selection
    - Implement `generateInvoices` server action
    - Generate unique invoice numbers in format INV-YYYYMM-XXXX
    - Get SPP amount from SystemConfig
    - Set due date to 10th of month
    - Skip students with existing invoices for that month/year
    - Display generation summary
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7_
  
  - [ ]* 9.2 Write property tests for invoice generation
    - **Property 26: Invoice number format and uniqueness**
    - **Property 27: Invoice duplicate prevention**
    - **Validates: Requirements 24.3, 24.6**
  
  - [x] 9.3 Create payment recording functionality
    - Build PaymentForm component
    - Implement `recordPayment` server action
    - Validate payment amount
    - Update invoice status based on payment amount
    - Handle partial payments (keep status PENDING)
    - Set paidAt timestamp
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8_
  
  - [ ]* 9.4 Write property tests for payment status logic
    - **Property 17: Partial payment status**
    - **Validates: Requirements 25.8**
  
  - [x] 9.5 Create payment history view
    - Add payment history section to student detail view
    - Display all invoices with status
    - Calculate total paid and outstanding amounts
    - Add filtering by status and year
    - _Requirements: 26.1, 26.2, 26.3, 26.4_
  
  - [x] 9.6 Implement financial reports
    - Create FinancialReport component
    - Implement `getFinancialReport` server action
    - Calculate statistics (total invoices, paid, pending, payment rate)
    - Display payment status breakdown
    - Add charts with recharts
    - Provide export options
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6_
  
  - [x] 9.7 Create financial data export
    - Implement export functionality for invoices
    - Support Excel and PDF formats
    - Include all invoice fields
    - Apply current filters
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6_


- [x] 10. Checkpoint - SPMB and Finance Modules Complete
  - Ensure SPMB workflow (register → verify → test → approve/reject) works correctly
  - Verify invoice generation and payment recording
  - Test financial reports and exports
  - Ask the user if questions arise

- [x] 11. Implement Academic Module - Calendar and Announcements
  - [x] 11.1 Create academic calendar management
    - Build calendar view component
    - Implement CRUD operations for calendar events
    - Create event form with title, date, description
    - Display events in calendar format
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5, 29.6, 29.7_
  
  - [x] 11.2 Create announcement management
    - Build AnnouncementList component
    - Implement CRUD operations for announcements
    - Create announcement form with title, content, pinned status
    - Sort by publish date with pinned items first
    - Allow academic year association
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7, 30.8_
  
  - [x] 11.3 Create school activity management with photos
    - Build ActivityList component
    - Implement CRUD operations for activities
    - Create activity form with title, description, date, location
    - Add multiple photo upload functionality
    - Validate photo file types and sizes
    - Create photo gallery view
    - _Requirements: 31.1, 31.2, 31.3, 31.4, 31.5, 31.6, 31.7, 31.8_

- [x] 12. Implement Settings Module - System Configuration
  - [x] 12.1 Create academic year management
    - Build AcademicYearManager component
    - Implement CRUD operations for academic years
    - Validate name uniqueness
    - Validate date range (start before end)
    - Implement active year toggle
    - Ensure only one active year at a time
    - _Requirements: 32.1, 32.2, 32.3, 32.4, 32.5, 32.6, 32.7_
  
  - [ ]* 12.2 Write property tests for academic year constraints
    - **Property 5: Uniqueness constraint enforcement (academic year name)**
    - **Property 15: Single active academic year**
    - **Property 16: Date range validation**
    - **Validates: Requirements 32.4, 32.5, 32.7**
  
  - [x] 12.3 Create system configuration management
    - Build ConfigEditor component
    - Display all configuration key-value pairs
    - Group configs by category (school info, financial settings)
    - Implement config update functionality
    - Validate config value formats
    - Apply changes immediately to relevant modules
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7_


  - [x] 12.4 Create user management functionality
    - Build UserList component
    - Implement user CRUD operations
    - Validate email uniqueness
    - Hash passwords before storing
    - Allow editing user info except password
    - Create separate password reset function
    - Allow user deactivation
    - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.5, 34.6, 34.7, 34.8, 34.9_
  
  - [ ]* 12.5 Write property tests for user validation
    - **Property 5: Uniqueness constraint enforcement (email)**
    - **Property 28: Email format validation**
    - **Validates: Requirements 34.4, 36.3**
  
  - [x] 12.6 Create activity log viewer
    - Build ActivityLogViewer component
    - Display logs with user, action, entity, timestamp, IP
    - Add filtering by user, action type, entity type, date range
    - Implement pagination (50 entries per page)
    - Add CSV export functionality
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5, 35.6_

- [x] 13. Implement Cross-Cutting Concerns
  - [x] 13.1 Add comprehensive form validation
    - Ensure all forms use Zod schemas
    - Display field-specific error messages
    - Validate email formats
    - Validate phone number formats
    - Validate date formats and ranges
    - Validate numeric ranges
    - Prevent submission with validation errors
    - Clear errors on input correction
    - _Requirements: 36.1, 36.2, 36.3, 36.4, 36.5, 36.6, 36.7, 36.8_
  
  - [ ]* 13.2 Write property tests for validation
    - **Property 28: Email format validation**
    - **Property 29: Phone format validation**
    - **Property 30: Zod schema validation application**
    - **Validates: Requirements 36.1, 36.3, 36.4**
  
  - [x] 13.3 Implement loading states across all operations
    - Add loading spinners for data fetches
    - Disable and show loading on submit buttons
    - Add upload progress indicators
    - Prevent duplicate submissions
    - Remove loading indicators on completion
    - _Requirements: 37.1, 37.2, 37.3, 37.4, 37.5_
  
  - [x] 13.4 Implement comprehensive error handling
    - Display user-friendly error messages for server errors
    - Display connectivity error messages for network errors
    - Display specific field errors for validation errors
    - Display access denied messages for permission errors
    - Log detailed error information for debugging
    - Provide retry options for transient errors
    - _Requirements: 38.1, 38.2, 38.3, 38.4, 38.5, 38.6_


  - [x] 13.5 Ensure responsive design across all pages
    - Test and adjust layouts for desktop (1920px+)
    - Test and adjust layouts for laptop (1024px-1919px)
    - Test and adjust layouts for tablet (768px-1023px)
    - Test and adjust layouts for mobile (<768px)
    - Implement hamburger menu for mobile sidebar
    - Stack form fields vertically on mobile
    - Make tables horizontally scrollable on mobile
    - Verify usability across all screen sizes
    - _Requirements: 39.1, 39.2, 39.3, 39.4, 39.5, 39.6, 39.7, 39.8_
  
  - [x] 13.6 Implement optimistic UI updates
    - Add optimistic updates for create operations
    - Add optimistic updates for update operations
    - Add optimistic updates for delete operations
    - Implement revert logic for failed operations
    - Display error notifications on failure
    - Maintain data consistency between optimistic and server state
    - _Requirements: 40.1, 40.2, 40.3, 40.4, 40.5, 40.6_
  
  - [x] 13.7 Implement activity logging for all operations
    - Log create actions with entity type, ID, and user ID
    - Log update actions with changed fields
    - Log delete actions with entity details
    - Capture IP address and user agent
    - Log authentication events
    - Store logs in ActivityLog table
    - Exclude read operations from logging
    - _Requirements: 41.1, 41.2, 41.3, 41.4, 41.5, 41.6, 41.7_
  
  - [ ]* 13.8 Write property tests for activity logging
    - **Property 31: Comprehensive action logging**
    - **Validates: Requirements 41.1, 41.2, 41.3**

- [x] 14. Final Integration and Testing
  - [x] 14.1 Run all unit tests and fix any failures
    - Execute test suite with `npm test`
    - Fix any failing unit tests
    - Ensure 80% minimum code coverage
  
  - [ ]* 14.2 Run all property-based tests and fix any failures
    - Execute property tests with 100 iterations each
    - Fix any failing property tests
    - Verify all 31 properties pass
  
  - [x] 14.3 Perform manual integration testing
    - Test complete user flows for each module
    - Verify data consistency across modules
    - Test error scenarios and edge cases
    - Verify responsive design on different devices
  
  - [x] 14.4 Performance optimization
    - Add database indexes for frequently queried fields
    - Optimize Prisma queries with proper includes
    - Implement query result caching where appropriate
    - Optimize image uploads and storage

- [x] 15. Final Checkpoint - Complete System Verification
  - Verify all modules are fully functional
  - Ensure all CRUD operations work correctly
  - Test import/export functionality across modules
  - Verify all validation rules are enforced
  - Confirm activity logging is working
  - Test responsive design on multiple devices
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- All server actions follow the same error handling pattern
- All forms use Zod validation for type safety
- All mutations use optimistic UI updates for responsiveness