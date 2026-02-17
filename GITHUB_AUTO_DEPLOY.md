# Setup GitHub Auto-Deploy - 3 Langkah! 🚀

## Langkah 1: Push ke GitHub (2 Menit)

### Opsi A: Gunakan Script Otomatis
```powershell
.\push-to-github.ps1
```

### Opsi B: Manual Command

```bash
# Jika belum ada git
git init
git add .
git commit -m "feat: complete implementation"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main

# Jika sudah ada git
git add .
git commit -m "feat: latest updates"
git push
```

**Ganti `USERNAME/REPO-NAME` dengan repository GitHub Anda!**

## Langkah 2: Connect Vercel ke GitHub (3 Menit)

1. **Buka Vercel Dashboard**:
   https://vercel.com/dashboard

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Pilih repository GitHub Anda
   - Click "Import"

3. **Add Environment Variables**:
   Copy dari `.env.vercel` dan paste di Vercel:
   
   ```
   DATABASE_URL=postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
   DIRECT_URL=postgresql://postgres:C8Mo7Vas9PmGSQH0@db.qjliveyhaqaywhyxnakj.supabase.co:5432/postgres
   NEXTAUTH_URL=https://madrasahalamin.vercel.app
   NEXTAUTH_SECRET=OBsTc53SKNX0Vz9jiegQ7AqmyIZfhFCx
   NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
   NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
   ```

4. **Deploy**:
   - Click "Deploy"
   - Tunggu 2-3 menit

## Langkah 3: Verifikasi Auto-Deploy (1 Menit)

Test auto-deploy dengan push dummy commit:

```bash
# Buat perubahan kecil
echo "# Test auto-deploy" >> README.md

# Commit & push
git add .
git commit -m "test: verify auto-deploy"
git push

# Cek Vercel Dashboard - harus auto-deploy! 🎉
```

## ✅ Setelah Setup Berhasil

### Workflow Baru Anda:

```bash
# 1. Buat perubahan
# Edit file...

# 2. Test lokal
npm run dev

# 3. Push ke GitHub
git add .
git commit -m "feat: add new feature"
git push

# 4. Vercel auto-deploy! ✨
# Cek di: https://vercel.com/dashboard
```

### Auto-Deploy Features:

✅ **Production Deploy**: Setiap push ke `main` → Auto-deploy ke production
✅ **Preview Deploy**: Setiap push ke branch lain → Auto-deploy ke preview URL
✅ **PR Preview**: Setiap Pull Request → Auto-deploy preview di comment PR
✅ **Rollback**: Bisa rollback ke deployment sebelumnya dengan 1 click

## Monitoring

### Vercel Dashboard:
- **Deployments**: Lihat semua deployment history
- **Logs**: Real-time logs untuk debugging
- **Analytics**: Traffic dan performance metrics

### Notifications:
- Email notification setiap deployment
- Slack/Discord integration (optional)
- GitHub commit status checks

## Troubleshooting

### Push ke GitHub Gagal?

**Error: Permission denied**
```bash
# Setup GitHub Personal Access Token
# 1. Buat token: https://github.com/settings/tokens
# 2. Push dengan token:
git push https://YOUR_TOKEN@github.com/USERNAME/REPO.git main
```

**Error: Remote already exists**
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO.git
```

### Vercel Tidak Auto-Deploy?

1. **Cek Connection**:
   - Vercel Dashboard → Your Project → Settings → Git
   - Pastikan connected ke GitHub repository

2. **Cek Auto-Deploy Setting**:
   - Settings → Git → Auto-deploy = ON

3. **Cek Webhook**:
   - GitHub → Repository → Settings → Webhooks
   - Harus ada webhook dari Vercel

4. **Re-connect**:
   - Vercel → Settings → Git → Disconnect
   - Connect ulang repository

### Build Failed di Vercel?

1. **Cek Logs**:
   - Vercel Dashboard → Deployments → Click failed deployment → View Logs

2. **Common Issues**:
   - Environment variables belum di-set
   - Database connection error
   - Build command error

3. **Fix**:
   - Add missing environment variables
   - Check `vercel.json` configuration
   - Test build locally: `npm run build`

## Best Practices

### Branch Strategy:

```
main (production)
  ↑
develop (staging)
  ↑
feature/new-feature (preview)
```

### Commit Messages:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

### Before Push:

```bash
# 1. Test lokal
npm run dev

# 2. Build test
npm run build

# 3. Check diagnostics
npm run lint

# 4. Commit & push
git add .
git commit -m "feat: description"
git push
```

## Verifikasi Setup

- [ ] Code ter-push ke GitHub
- [ ] Vercel connected ke repository
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Auto-deploy tested (push dummy commit)
- [ ] Production URL accessible
- [ ] Database connected and seeded

## URLs

- **GitHub Repository**: https://github.com/USERNAME/REPO-NAME
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Production URL**: https://madrasahalamin.vercel.app
- **Vercel Logs**: https://vercel.com/dashboard → Your Project → Logs

---

**Ready?** Jalankan Langkah 1 sekarang! 🚀

## Quick Start (Copy-Paste All)

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: complete implementation with auto-deploy"
git push

# 2. Open Vercel Dashboard
start https://vercel.com/dashboard

# 3. Import project and deploy!
```

Setelah itu, setiap `git push` akan otomatis deploy ke Vercel! ✨
