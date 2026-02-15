# 🗄️ Database Documentation

## Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────1:1──│   Teacher    │────1:N──│    Class    │
│             │         │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - email     │         │ - userId     │         │ - name      │
│ - password  │         │ - nip        │         │ - grade     │
│ - name      │         │ - phone      │         │ - capacity  │
│ - role      │         │ - subjects   │         └─────────────┘
│ - isActive  │         └──────────────┘                │
└─────────────┘                                         │ N:M
      │                                                 │
      │ 1:1                                    ┌────────┴────────┐
      │                                        │  ClassStudent   │
┌─────┴───────┐         ┌──────────────┐      │                 │
│   Parent    │────1:N──│   Student    │──────│ - classId       │
│             │         │              │      │ - studentId     │
│ - id        │         │ - id         │      └─────────────────┘
│ - userId    │         │ - nis        │
│ - fatherName│         │ - name       │
│ - motherName│         │ - gender     │
│ - phone     │         │ - parentId   │
└─────────────┘         │ - isActive   │
                        └──────────────┘
                               │
                               │ 1:N
                               │
                        ┌──────┴───────┐
                        │   Invoice    │
                        │              │
                        │ - id         │
                        │ - studentId  │
                        │ - amount     │
                        │ - status     │
                        │ - dueDate    │
                        └──────────────┘

┌──────────────────┐         ┌──────────────────┐
│  AcademicYear    │────1:N──│ SPMBApplicant    │
│                  │         │                  │
│ - id             │         │ - id             │
│ - name           │         │ - registrationNo │
│ - startDate      │         │ - name           │
│ - endDate        │         │ - status         │
│ - isActive       │         │ - testScore      │
└──────────────────┘         └──────────────────┘
```

## Tables Detail

### 1. User
Tabel utama untuk autentikasi dan otorisasi.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| email | String (Unique) | Email login |
| password | String | Hashed password (bcrypt) |
| name | String | Nama lengkap |
| role | Enum | SUPER_ADMIN, ADMIN, TEACHER, PARENT, STUDENT |
| avatar | String? | URL foto profil |
| isActive | Boolean | Status aktif (default: true) |
| lastLogin | DateTime? | Waktu login terakhir |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update terakhir |
| deletedAt | DateTime? | Soft delete timestamp |

**Relations:**
- 1:1 dengan Teacher
- 1:1 dengan Parent
- 1:N dengan ActivityLog

**Indexes:**
- email
- role

---

### 2. Teacher
Data guru/tenaga pendidik.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String (Unique) | Foreign key ke User |
| nip | String (Unique) | Nomor Induk Pegawai |
| phone | String | Nomor telepon |
| address | String | Alamat lengkap |
| dateOfBirth | DateTime | Tanggal lahir |
| gender | Enum | MALE, FEMALE |
| joinDate | DateTime | Tanggal bergabung |
| subjects | String[] | Array mata pelajaran |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan User
- 1:N dengan Class

**Indexes:**
- nip

---

### 3. Student
Data siswa.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| nis | String (Unique) | Nomor Induk Siswa |
| nisn | String? (Unique) | Nomor Induk Siswa Nasional |
| name | String | Nama lengkap |
| gender | Enum | MALE, FEMALE |
| dateOfBirth | DateTime | Tanggal lahir |
| placeOfBirth | String | Tempat lahir |
| address | String | Alamat lengkap |
| phone | String? | Nomor telepon |
| photo | String? | URL foto |
| parentId | String | Foreign key ke Parent |
| enrollmentDate | DateTime | Tanggal masuk |
| isActive | Boolean | Status aktif |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan Parent
- N:M dengan Class (via ClassStudent)
- 1:N dengan Invoice

**Indexes:**
- nis
- parentId

---

### 4. Parent
Data orang tua/wali siswa.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String (Unique) | Foreign key ke User |
| fatherName | String | Nama ayah |
| motherName | String | Nama ibu |
| phone | String | Nomor telepon |
| address | String | Alamat lengkap |
| occupation | String? | Pekerjaan |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan User
- 1:N dengan Student

---

### 5. Class
Data kelas per tahun ajaran.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| name | String | Nama kelas (e.g., "Kelas 1A") |
| grade | Int | Tingkat kelas (1-6) |
| academicYearId | String | Foreign key ke AcademicYear |
| teacherId | String | Foreign key ke Teacher (wali kelas) |
| capacity | Int | Kapasitas maksimal (default: 30) |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan AcademicYear
- N:1 dengan Teacher
- N:M dengan Student (via ClassStudent)

**Unique Constraint:**
- (name, academicYearId)

**Indexes:**
- academicYearId
- grade

---

### 6. ClassStudent
Junction table untuk relasi Class dan Student (N:M).

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| classId | String | Foreign key ke Class |
| studentId | String | Foreign key ke Student |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |

**Unique Constraint:**
- (classId, studentId)

**Indexes:**
- classId
- studentId

---

### 7. AcademicYear
Data tahun ajaran.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| name | String (Unique) | Nama tahun ajaran (e.g., "2026/2027") |
| startDate | DateTime | Tanggal mulai |
| endDate | DateTime | Tanggal selesai |
| isActive | Boolean | Status aktif (hanya 1 yang aktif) |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- 1:N dengan Class
- 1:N dengan SPMBApplicant
- 1:N dengan Invoice
- 1:N dengan Announcement

**Indexes:**
- isActive

---

### 8. SPMBApplicant
Data pendaftar siswa baru.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| registrationNo | String (Unique) | Nomor pendaftaran (auto) |
| academicYearId | String | Foreign key ke AcademicYear |
| name | String | Nama lengkap |
| gender | Enum | MALE, FEMALE |
| dateOfBirth | DateTime | Tanggal lahir |
| placeOfBirth | String | Tempat lahir |
| address | String | Alamat lengkap |
| parentName | String | Nama orang tua |
| parentPhone | String | Nomor telepon orang tua |
| parentEmail | String? | Email orang tua |
| previousSchool | String? | Asal sekolah (TK/RA) |
| photo | String? | URL foto |
| birthCertificate | String? | URL akta kelahiran |
| familyCard | String? | URL kartu keluarga |
| testScore | Float? | Nilai tes seleksi |
| status | Enum | REGISTERED, VERIFIED, TESTED, PASSED, FAILED, ENROLLED |
| notes | String? | Catatan |
| registeredAt | DateTime | Waktu pendaftaran |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan AcademicYear

**Indexes:**
- registrationNo
- status
- academicYearId

---

### 9. Invoice
Data tagihan pembayaran (SPP).

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| invoiceNo | String (Unique) | Nomor invoice (auto) |
| studentId | String | Foreign key ke Student |
| academicYearId | String | Foreign key ke AcademicYear |
| month | Int | Bulan (1-12) |
| year | Int | Tahun |
| amount | Float | Nominal tagihan |
| status | Enum | PENDING, PAID, OVERDUE, CANCELLED |
| dueDate | DateTime | Tanggal jatuh tempo |
| paidAt | DateTime? | Waktu pembayaran |
| paidAmount | Float? | Nominal dibayar |
| notes | String? | Catatan |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan Student
- N:1 dengan AcademicYear

**Unique Constraint:**
- (studentId, month, year, academicYearId)

**Indexes:**
- invoiceNo
- status
- studentId

---

### 10. Announcement
Data pengumuman.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Judul pengumuman |
| content | String | Isi pengumuman |
| academicYearId | String? | Foreign key ke AcademicYear |
| publishedAt | DateTime | Waktu publikasi |
| isPinned | Boolean | Pin di atas (default: false) |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Relations:**
- N:1 dengan AcademicYear (optional)

**Indexes:**
- publishedAt
- isPinned

---

### 11. Activity
Data kegiatan sekolah.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| title | String | Judul kegiatan |
| description | String | Deskripsi |
| date | DateTime | Tanggal kegiatan |
| location | String? | Lokasi |
| photos | String[] | Array URL foto |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |
| deletedAt | DateTime? | Soft delete |

**Indexes:**
- date

---

### 12. ActivityLog
Audit log untuk tracking aktivitas user.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| userId | String | Foreign key ke User |
| action | String | Aksi yang dilakukan |
| entity | String | Entity yang diubah |
| entityId | String? | ID entity |
| details | String? | Detail perubahan (JSON) |
| ipAddress | String? | IP address |
| userAgent | String? | User agent |
| createdAt | DateTime | Waktu aksi |

**Relations:**
- N:1 dengan User

**Indexes:**
- userId
- createdAt
- entity

---

### 13. SystemConfig
Konfigurasi sistem.

| Column | Type | Description |
|--------|------|-------------|
| id | String (CUID) | Primary key |
| key | String (Unique) | Key konfigurasi |
| value | String | Value konfigurasi |
| description | String? | Deskripsi |
| createdAt | DateTime | Waktu dibuat |
| updatedAt | DateTime | Waktu update |

**Indexes:**
- key

**Default Configs:**
- `school_name`: Nama sekolah
- `school_address`: Alamat sekolah
- `school_phone`: Nomor telepon
- `school_email`: Email sekolah
- `spp_amount`: Nominal SPP per bulan

---

## Enums

### Role
```typescript
enum Role {
  SUPER_ADMIN  // Full access
  ADMIN        // Manage data
  TEACHER      // View & input nilai
  PARENT       // View data anak
  STUDENT      // View data sendiri (future)
}
```

### Gender
```typescript
enum Gender {
  MALE
  FEMALE
}
```

### PaymentStatus
```typescript
enum PaymentStatus {
  PENDING    // Belum dibayar
  PAID       // Sudah dibayar
  OVERDUE    // Terlambat
  CANCELLED  // Dibatalkan
}
```

### SPMBStatus
```typescript
enum SPMBStatus {
  REGISTERED  // Baru daftar
  VERIFIED    // Data terverifikasi
  TESTED      // Sudah tes
  PASSED      // Lulus seleksi
  FAILED      // Tidak lulus
  ENROLLED    // Sudah daftar ulang
}
```

---

## Indexes Strategy

### Performance Optimization
- **Primary Keys**: Semua tabel menggunakan CUID untuk distributed system
- **Foreign Keys**: Auto-indexed oleh Prisma
- **Unique Constraints**: Email, NIS, NIP, Registration Number
- **Search Indexes**: Nama, status, tanggal

### Query Optimization
```sql
-- Contoh query yang di-optimize dengan index

-- Cari siswa aktif
SELECT * FROM students WHERE isActive = true;
-- Index: isActive

-- Cari tagihan pending
SELECT * FROM invoices WHERE status = 'PENDING';
-- Index: status

-- Cari pendaftar SPMB tahun ini
SELECT * FROM spmb_applicants 
WHERE academicYearId = 'xxx' AND status = 'REGISTERED';
-- Index: academicYearId, status
```

---

## Backup Strategy

### Daily Backup
```bash
# Automated backup script
pg_dump -U asms_user asms_alamin > backup_$(date +%Y%m%d).sql
```

### Retention Policy
- Daily backups: 7 hari
- Weekly backups: 4 minggu
- Monthly backups: 12 bulan

---

## Migration Guide

### Add New Column
```bash
# Edit schema.prisma
# Tambahkan column baru

# Generate migration
npx prisma migrate dev --name add_new_column

# Apply to production
npx prisma migrate deploy
```

### Modify Existing Column
```bash
# Edit schema.prisma
# Ubah column

# Generate migration
npx prisma migrate dev --name modify_column

# Review migration file di prisma/migrations
# Apply to production
npx prisma migrate deploy
```

---

## Security Best Practices

1. **Password Hashing**: Gunakan bcrypt dengan salt rounds 10
2. **Soft Delete**: Jangan hapus data permanen, gunakan `deletedAt`
3. **Activity Logging**: Log semua perubahan data penting
4. **Row Level Security**: Implement di application level
5. **Backup Encryption**: Encrypt backup files
6. **Connection Pooling**: Gunakan Prisma connection pooling

---

## Performance Tips

1. **Use Indexes**: Tambahkan index untuk kolom yang sering di-query
2. **Pagination**: Selalu gunakan pagination untuk list data
3. **Select Specific Fields**: Jangan `SELECT *`, pilih field yang dibutuhkan
4. **Connection Pooling**: Set `connection_limit` di DATABASE_URL
5. **Query Optimization**: Gunakan `include` dan `select` dengan bijak

```typescript
// ❌ Bad: N+1 query problem
const students = await prisma.student.findMany();
for (const student of students) {
  const parent = await prisma.parent.findUnique({
    where: { id: student.parentId }
  });
}

// ✅ Good: Single query with include
const students = await prisma.student.findMany({
  include: { parent: true }
});
```

---

## Monitoring

### Key Metrics
- Query response time
- Connection pool usage
- Database size
- Slow queries
- Error rate

### Tools
- Prisma Studio: `npx prisma studio`
- PostgreSQL logs
- Supabase Dashboard (jika pakai Supabase)
- Railway Metrics (jika pakai Railway)
