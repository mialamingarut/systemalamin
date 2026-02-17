# Script untuk update Vercel environment variables ke Neon database
# Pastikan Vercel CLI sudah terinstall: npm i -g vercel

Write-Host "🔄 Updating Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Database URL untuk Neon
$DATABASE_URL = "postgresql://neondb_owner:npg_a6sMHnbSfP7u@ep-withered-queen-aifmltu5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"

Write-Host "📝 Setting DATABASE_URL..." -ForegroundColor Yellow
vercel env rm DATABASE_URL production --yes 2>$null
vercel env add DATABASE_URL production

Write-Host ""
Write-Host "Paste this value when prompted:" -ForegroundColor Green
Write-Host $DATABASE_URL -ForegroundColor White
Write-Host ""

Write-Host "✅ Environment variable updated!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Now redeploy your project:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "Or redeploy from Vercel Dashboard:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/mialamingarut/systemalamin/deployments" -ForegroundColor White
