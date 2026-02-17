# Production Database Migration Guide

## Migration Required: Add Teacher Photo Field

### SQL Command
Run this SQL command in your production PostgreSQL database (Vercel):

```sql
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "photo" TEXT;
```

### How to Run Migration on Vercel

#### Option 1: Using Vercel Postgres Dashboard
1. Go to Vercel Dashboard
2. Select your project: `systemalamin`
3. Go to Storage tab
4. Click on your Postgres database
5. Click "Query" tab
6. Paste the SQL command above
7. Click "Run Query"

#### Option 2: Using Prisma Studio
1. Open terminal
2. Run: `npx prisma studio --browser none`
3. Or use Vercel's Prisma Studio integration

#### Option 3: Using psql CLI
```bash
# Connect to your database
psql "your-database-connection-string"

# Run migration
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "photo" TEXT;

# Verify
\d "Teacher"
```

### Verification

After running the migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Teacher' AND column_name = 'photo';

-- Should return:
-- column_name | data_type | is_nullable
-- photo       | text      | YES
```

### Rollback (if needed)

If you need to rollback this migration:

```sql
ALTER TABLE "Teacher" DROP COLUMN IF EXISTS "photo";
```

## Post-Migration Steps

1. ✅ Run migration SQL
2. ✅ Verify column exists
3. ✅ Test photo upload in production
4. ✅ Check landing page displays photos
5. ✅ Test edit existing teachers

## Testing in Production

1. **Upload Test**:
   - Login to production dashboard
   - Go to Data Guru
   - Edit a teacher
   - Upload a photo
   - Save and verify

2. **Display Test**:
   - Visit landing page
   - Scroll to "Guru Kami" section
   - Verify photos display correctly
   - Check fallback icon for teachers without photos

3. **Performance Test**:
   - Check page load time
   - Verify images load properly
   - Test on mobile devices
   - Check responsive layout

## Troubleshooting

### Issue: Column already exists
**Error**: `column "photo" of relation "Teacher" already exists`
**Solution**: Migration already ran, no action needed

### Issue: Permission denied
**Error**: `permission denied for table Teacher`
**Solution**: Ensure you're using database admin credentials

### Issue: Photos not displaying
**Possible causes**:
1. Migration not run
2. Upload folder permissions
3. Image path incorrect
4. Database connection issue

**Debug steps**:
```sql
-- Check if photo column has data
SELECT id, photo FROM "Teacher" WHERE photo IS NOT NULL LIMIT 5;
```

### Issue: Upload fails
**Possible causes**:
1. File size too large (>2MB)
2. Invalid file type
3. Server permissions
4. Disk space

**Check**:
- Browser console for errors
- Server logs in Vercel
- File size and type
- Upload folder exists

## Database Schema After Migration

```prisma
model Teacher {
  id            String    @id @default(cuid())
  userId        String    @unique
  nip           String    @unique
  phone         String
  address       String
  dateOfBirth   DateTime
  gender        Gender
  joinDate      DateTime
  subjects      String[]
  photo         String?   // ← NEW FIELD
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  classes       Class[]

  @@index([nip])
}
```

## Important Notes

- ⚠️ This migration is NON-DESTRUCTIVE (only adds a column)
- ⚠️ Existing data is NOT affected
- ⚠️ Column is NULLABLE (existing teachers can have NULL photo)
- ⚠️ No downtime required
- ⚠️ Can be run during production hours

## Migration Status

- [x] Schema updated in code
- [x] Prisma client regenerated
- [x] Code deployed to GitHub
- [x] Vercel auto-deployed
- [ ] **TODO: Run SQL migration in production database**
- [ ] **TODO: Test photo upload in production**
- [ ] **TODO: Verify landing page displays photos**

## Contact

If you encounter issues:
1. Check Vercel logs
2. Check browser console
3. Verify migration ran successfully
4. Test with small image first
