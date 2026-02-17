# Push ke GitHub & Setup Auto-Deploy

## Langkah 1: Cek Status Git

```bash
# Cek apakah sudah ada git repository
git status
```

Jika belum ada git repository, lanjut ke Langkah 2.
Jika sudah ada, lanjut ke Langkah 3.

## Langkah 2: Initialize Git (Jika Belum Ada)

```bash
# Initialize git
git init

# Add remote repository (ganti dengan URL GitHub Anda)
git remote add origin https://github.com/USERNAME/REPO-NAME.git

# Atau jika sudah ada remote, update URL
git remote set-url origin https://github.com/USERNAME/REPO-NAME.git
```

## Langkah 3: Add & Commit Semua Perubahan

```bash
# Add semua file
git add .

# Commit dengan message
git commit -m "feat: complete implementation with all fixes

- Fixed logo display in sidebar (removed white background)
- Fixed redirect issue (allow logged-in users to access landing page)
- Added error components (error.tsx, global-error.tsx, not-found.tsx)
- Updated Navbar to show user name when logged in
- Added SessionProvider to root layout
- Fixed auth.config.ts redirect logic
- Added deployment scripts and documentation
- Ready for production deployment"
```

## Langkah 4: Push ke GitHub

```bash
# Push ke branch main
git push -u origin main

# Atau jika branch Anda adalah master
git push -u origin master
```

### Jika Ada Error "Permission Denied"

Anda perlu setup authentication:

#### Opsi A: HTTPS dengan Personal Access Token

1. Buat Personal Access Token di GitHub:
   - Buka https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Pilih scope: `repo` (full control)
   - Copy token

2. Push dengan token:
```bash
git push https://YOUR_TOKEN@github.com/USERNAME/REPO-NAME.git main
```

#### Opsi B: SSH Key

1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add SSH key ke GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Buka https://github.com/settings/keys
   - Click "New SSH key"
   - Paste key

3. Change remote to SSH:
```bash
git remote set-url origin git@github.com:USERNAME/REPO-NAME.git
git push -u origin main
```

## Langkah 5: Connect Vercel ke GitHub

### Via Vercel Dashboard:

1. **Login ke Vercel**:
   - Buka https://vercel.com/login
   - Login dengan GitHub account

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Pilih repository GitHub Anda
   - Click "Import"

3. **Configure Project**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `prisma generate && next build` (sudah di vercel.json)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**:
   Copy dari `.env.vercel` dan paste satu per satu:
   
   ```
   DATABASE_URL=postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
   DIRECT_URL=postgresql://postgres:C8Mo7Vas9PmGSQH0@db.qjliveyhaqaywhyxnakj.supabase.co:5432/postgres
   NEXTAUTH_URL=https://madrasahalamin.vercel.app
   NEXTAUTH_SECRET=OBsTc53SKNX0Vz9jiegQ7AqmyIZfhFCx
   NEXT_PUBLIC_APP_NAME=AL-AMIN School Management System
   NEXT_PUBLIC_SCHOOL_NAME=Madrasah Ibtidaiyah Al-Amin
   ```

5. **Deploy**:
   - Click "Deploy"
   - Tunggu build selesai (2-3 menit)

## Langkah 6: Setup Auto-Deploy

Setelah connect ke GitHub, Vercel akan otomatis:

✅ **Auto-deploy setiap push ke main/master**
- Push ke GitHub → Vercel auto-build → Auto-deploy

✅ **Preview deployment untuk setiap branch**
- Buat branch baru → Push → Vercel buat preview URL

✅ **Preview deployment untuk setiap Pull Request**
- Buat PR → Vercel buat preview URL di comment PR

### Configure Auto-Deploy Settings:

1. Di Vercel Dashboard → Your Project → Settings → Git
2. Configure:
   - **Production Branch**: `main` (atau `master`)
   - **Auto-deploy**: ON
   - **Preview Deployments**: ON
   - **Deploy Hooks**: (optional, untuk trigger manual)

## Workflow Setelah Setup

### Untuk Update Aplikasi:

```bash
# 1. Buat perubahan di code
# 2. Test lokal
npm run dev

# 3. Build test
npm run build

# 4. Commit & push
git add .
git commit -m "feat: add new feature"
git push

# 5. Vercel akan auto-deploy! 🚀
```

### Monitor Deployment:

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Deployment Logs**: Your Project → Deployments → Click deployment → View Logs
3. **Real-time Logs**: Vercel akan kirim notifikasi via email/Slack

## Troubleshooting

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO-NAME.git
```

### Error: "Updates were rejected"
```bash
# Force push (HATI-HATI: akan overwrite remote)
git push -f origin main

# Atau pull dulu, lalu push
git pull origin main --rebase
git push origin main
```

### Error: "Build failed on Vercel"
1. Cek logs di Vercel Dashboard
2. Pastikan environment variables sudah di-set
3. Pastikan `vercel.json` ada di root project

### Vercel tidak auto-deploy
1. Cek Settings → Git → Auto-deploy = ON
2. Cek webhook di GitHub: Settings → Webhooks
3. Re-connect repository di Vercel

## Verifikasi Setup Berhasil

- [ ] Code ter-push ke GitHub
- [ ] Vercel connected ke GitHub repository
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Auto-deploy working (test dengan push dummy commit)

## Bonus: Setup Branch Protection

Di GitHub repository → Settings → Branches → Add rule:

- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (Vercel deployment)

Ini akan memastikan code review sebelum merge ke production.

---

**Ready?** Jalankan command di atas sekarang! 🚀

## Quick Commands (Copy-Paste)

```bash
# Initialize & push (jika belum ada git)
git init
git add .
git commit -m "feat: initial commit - complete implementation"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main

# Update & push (jika sudah ada git)
git add .
git commit -m "feat: update with latest fixes"
git push
```

Ganti `USERNAME` dan `REPO-NAME` dengan GitHub username dan repository name Anda!
