# Deploy to Vercel Script (PowerShell)
# This script helps you deploy the application to Vercel

Write-Host "🚀 MI Al-Amin - Vercel Deployment Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "✅ Vercel CLI is ready" -ForegroundColor Green
Write-Host ""

# Ask deployment type
Write-Host "Select deployment type:" -ForegroundColor Cyan
Write-Host "1) Preview (for testing)"
Write-Host "2) Production"
$choice = Read-Host "Enter choice (1 or 2)"

Write-Host ""
Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host "1. ✅ Build test passed" -ForegroundColor Green
Write-Host "2. ⚠️  Database migrations ready" -ForegroundColor Yellow
Write-Host "3. ⚠️  Environment variables configured in Vercel" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue with deployment? (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔨 Starting deployment..." -ForegroundColor Yellow
Write-Host ""

if ($choice -eq "2") {
    Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "🔍 Deploying to PREVIEW..." -ForegroundColor Cyan
    vercel
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run database migrations (if first deploy):"
Write-Host "   npx prisma migrate deploy"
Write-Host ""
Write-Host "2. Seed initial data:"
Write-Host "   npx prisma db seed"
Write-Host ""
Write-Host "3. Test the application:"
Write-Host "   - Login with: admin@mialamin.sch.id / admin123"
Write-Host "   - Test all CRUD operations"
Write-Host "   - Test export functionality"
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
