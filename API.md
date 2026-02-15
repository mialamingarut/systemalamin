# 📡 API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

Semua endpoint (kecuali public) memerlukan authentication menggunakan NextAuth session.

### Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "admin@mialamin.sch.id",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "email": "admin@mialamin.sch.id",
    "name": "Super Admin",
    "role": "SUPER_ADMIN"
  }
}
```

---

## Students API

### List Students
```http
GET /api/students?page=1&limit=10&search=&isActive=true
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or NIS
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "data": [
    {
      "id": "clx...",
      "nis": "2026001",
      "nisn": "0012345678",
      "name": "Muhammad Rizki",
      "gender": "MALE",
      "dateOfBirth": "2019-05-15T00:00:00.000Z",
      "placeOfBirth": "Jakarta",
      "address": "Jl. Keluarga No. 456",
      "phone": "081234567891",
      "isActive": true,
      "parent": {
        "id": "clx...",
        "fatherName": "Budi Santoso",
        "motherName": "Siti Aminah",
        "phone": "081234567891"
      },
      "classStudents": [
        {
          "class": {
            "name": "Kelas 1A",
            "grade": 1,
            "academicYear": {
              "name": "2026/2027"
            }
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Student by ID
```http
GET /api/students/:id
```

**Response:**
```json
{
  "id": "clx...",
  "nis": "2026001",
  "name": "Muhammad Rizki",
  "gender": "MALE",
  "dateOfBirth": "2019-05-15T00:00:00.000Z",
  "placeOfBirth": "Jakarta",
  "address": "Jl. Keluarga No. 456",
  "phone": "081234567891",
  "isActive": true,
  "parent": { ... },
  "classStudents": [ ... ],
  "invoices": [ ... ]
}
```

### Create Student
```http
POST /api/students
Content-Type: application/json

{
  "nis": "2026003",
  "nisn": "0012345680",
  "name": "Ahmad Zaki",
  "gender": "MALE",
  "dateOfBirth": "2019-03-10",
  "placeOfBirth": "Jakarta",
  "address": "Jl. Pendidikan No. 789",
  "phone": "081234567892",
  "parentId": "clx...",
  "enrollmentDate": "2026-07-01"
}
```

**Response:**
```json
{
  "id": "clx...",
  "nis": "2026003",
  "name": "Ahmad Zaki",
  ...
}
```

### Update Student
```http
PUT /api/students/:id
Content-Type: application/json

{
  "name": "Ahmad Zaki Updated",
  "phone": "081234567899",
  "address": "New Address"
}
```

### Delete Student (Soft Delete)
```http
DELETE /api/students/:id
```

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

---

## Teachers API

### List Teachers
```http
GET /api/teachers?page=1&limit=10&search=
```

### Create Teacher
```http
POST /api/teachers
Content-Type: application/json

{
  "email": "guru.baru@mialamin.sch.id",
  "password": "password123",
  "name": "Fatimah Zahra, S.Pd",
  "nip": "198601012011012001",
  "phone": "081234567893",
  "address": "Jl. Guru No. 123",
  "dateOfBirth": "1986-01-01",
  "gender": "FEMALE",
  "joinDate": "2011-07-01",
  "subjects": ["Bahasa Indonesia", "PKn"]
}
```

---

## Classes API

### List Classes
```http
GET /api/classes?academicYearId=clx...
```

### Create Class
```http
POST /api/classes
Content-Type: application/json

{
  "name": "Kelas 2A",
  "grade": 2,
  "academicYearId": "clx...",
  "teacherId": "clx...",
  "capacity": 30
}
```

### Assign Student to Class
```http
POST /api/classes/:classId/students
Content-Type: application/json

{
  "studentId": "clx..."
}
```

### Remove Student from Class
```http
DELETE /api/classes/:classId/students/:studentId
```

---

## SPMB API

### List Applicants
```http
GET /api/spmb/applicants?status=REGISTERED&academicYearId=clx...
```

**Query Parameters:**
- `status`: REGISTERED, VERIFIED, TESTED, PASSED, FAILED, ENROLLED
- `academicYearId`: Filter by academic year

### Create Application
```http
POST /api/spmb/register
Content-Type: multipart/form-data

{
  "name": "Aisyah Putri",
  "gender": "FEMALE",
  "dateOfBirth": "2019-06-25",
  "placeOfBirth": "Jakarta",
  "address": "Jl. Pendaftar No. 2",
  "parentName": "Ibrahim Malik",
  "parentPhone": "081234567893",
  "parentEmail": "ibrahim@example.com",
  "previousSchool": "RA Al-Ikhlas",
  "photo": [File],
  "birthCertificate": [File],
  "familyCard": [File]
}
```

**Response:**
```json
{
  "id": "clx...",
  "registrationNo": "SPMB-2026-0003",
  "name": "Aisyah Putri",
  "status": "REGISTERED",
  "message": "Pendaftaran berhasil! Silakan catat nomor pendaftaran Anda."
}
```

### Update Application Status
```http
PATCH /api/spmb/applicants/:id
Content-Type: application/json

{
  "status": "VERIFIED",
  "notes": "Data lengkap dan valid"
}
```

### Input Test Score
```http
PATCH /api/spmb/applicants/:id/score
Content-Type: application/json

{
  "testScore": 85.5
}
```

### Check Admission Result
```http
GET /api/spmb/check/:registrationNo
```

**Response:**
```json
{
  "registrationNo": "SPMB-2026-0003",
  "name": "Aisyah Putri",
  "status": "PASSED",
  "testScore": 85.5,
  "message": "Selamat! Anda dinyatakan LULUS seleksi."
}
```

---

## Finance API

### List Invoices
```http
GET /api/finance/invoices?studentId=clx...&status=PENDING
```

### Generate Monthly Invoices
```http
POST /api/finance/invoices/generate
Content-Type: application/json

{
  "academicYearId": "clx...",
  "month": 7,
  "year": 2026,
  "amount": 250000
}
```

**Response:**
```json
{
  "message": "Generated 487 invoices successfully",
  "count": 487
}
```

### Record Payment
```http
POST /api/finance/payments
Content-Type: application/json

{
  "invoiceId": "clx...",
  "paidAmount": 250000,
  "paidAt": "2026-07-05T10:00:00.000Z",
  "notes": "Pembayaran via transfer"
}
```

### Get Payment Report
```http
GET /api/finance/reports?month=7&year=2026
```

**Response:**
```json
{
  "month": 7,
  "year": 2026,
  "totalInvoices": 487,
  "totalPaid": 450,
  "totalPending": 37,
  "totalAmount": 121750000,
  "paidAmount": 112500000,
  "pendingAmount": 9250000,
  "paymentRate": 92.4
}
```

---

## Academic API

### List Announcements
```http
GET /api/academic/announcements?isPinned=true
```

### Create Announcement
```http
POST /api/academic/announcements
Content-Type: application/json

{
  "title": "Libur Hari Raya",
  "content": "Sekolah libur tanggal 10-15 Juli 2026",
  "academicYearId": "clx...",
  "isPinned": true
}
```

### List Activities
```http
GET /api/academic/activities?startDate=2026-07-01&endDate=2026-07-31
```

### Create Activity
```http
POST /api/academic/activities
Content-Type: multipart/form-data

{
  "title": "Outing Class Kelas 5",
  "description": "Kunjungan ke Museum Nasional",
  "date": "2026-07-20",
  "location": "Museum Nasional Jakarta",
  "photos": [File, File, File]
}
```

---

## System API

### Get System Config
```http
GET /api/system/config
```

**Response:**
```json
{
  "school_name": "Madrasah Ibtidaiyah Al-Amin",
  "school_address": "Jl. Pendidikan No. 123, Jakarta Selatan",
  "school_phone": "0812-3456-7890",
  "school_email": "info@mialamin.sch.id",
  "spp_amount": "250000"
}
```

### Update System Config
```http
PUT /api/system/config
Content-Type: application/json

{
  "spp_amount": "275000"
}
```

### Get Activity Logs
```http
GET /api/system/logs?userId=clx...&entity=Student&startDate=2026-07-01
```

---

## File Upload API

### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "file": [File],
  "type": "photo" | "document"
}
```

**Response:**
```json
{
  "url": "https://yourdomain.com/uploads/photo-123456.jpg",
  "filename": "photo-123456.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

**Allowed Types:**
- Images: jpg, jpeg, png, gif (max 2MB)
- Documents: pdf (max 5MB)

---

## Export API

### Export Students to Excel
```http
GET /api/export/students?format=xlsx
```

**Response:** Excel file download

### Export Invoices to Excel
```http
GET /api/export/invoices?month=7&year=2026&format=xlsx
```

### Generate PDF Report
```http
GET /api/export/report?type=payment&month=7&year=2026
```

**Response:** PDF file download

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "details": {
    "field": "nis",
    "message": "NIS is required"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Please login to access this resource"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Student with ID clx... not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong. Please try again later."
}
```

---

## Rate Limiting

- **Public endpoints**: 100 requests per 15 minutes
- **Authenticated endpoints**: 1000 requests per 15 minutes
- **File upload**: 10 requests per minute

---

## Webhooks (Future)

### Payment Notification
```http
POST /api/webhooks/payment
Content-Type: application/json

{
  "event": "payment.success",
  "invoiceId": "clx...",
  "amount": 250000,
  "paidAt": "2026-07-05T10:00:00.000Z"
}
```

---

## Testing

### Postman Collection
Import file `postman_collection.json` untuk testing API.

### Example cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mialamin.sch.id","password":"admin123"}'

# Get Students
curl -X GET http://localhost:3000/api/students?page=1&limit=10 \
  -H "Cookie: next-auth.session-token=..."

# Create Student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"nis":"2026003","name":"Ahmad Zaki",...}'
```

---

## Best Practices

1. **Always use HTTPS** in production
2. **Validate input** on both client and server
3. **Handle errors gracefully**
4. **Use pagination** for list endpoints
5. **Implement caching** for frequently accessed data
6. **Log all important actions**
7. **Rate limit** to prevent abuse
8. **Version your API** (e.g., /api/v1/students)

---

## Support

Butuh bantuan dengan API?
- Email: dev@mialamin.sch.id
- Documentation: https://docs.mialamin.sch.id
