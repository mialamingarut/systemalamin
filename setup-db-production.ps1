# Setup Production Database Script
# Run this AFTER deploying to Vercel

Write-Host "🗄️  MI Al-Amin - Production Database Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Production database URL
$DATABASE_URL = "postgresql://postgres.qjliveyhaqaywhyxnakj:C8Mo7Vas9PmGSQH0@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

Write-Host "📋 This script will:" -ForegroundColor Cyan
Write-Host "1. Connect to Supabase PostgreSQL database"
Write-Host "2. Create all tables (User, Student, Teacher, etc.)"
Write-Host "3. Seed initial data (admin user, academic year)"
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ Setup cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔌 Setting database connection..." -ForegroundColor Yellow
$env:DATABASE_URL = $DATABASE_URL

Write-Host "✅ Database URL set" -ForegroundColor Green
Write-Host ""

# Test connection
Write-Host "🔍 Testing database connection..." -ForegroundColor Yellow
try {
    npx prisma db execute --stdin --schema=prisma/schema-postgresql.prisma <<< "SELECT 1;"
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to database!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. Supabase project is active"
    Write-Host "2. Database URL is correct"
    Write-Host "3. IP whitelist allows connections"
    exit 1
}

Write-Host ""
Write-Host "📦 Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push --schema=prisma/schema-postgresql.prisma --accept-data-loss

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push schema!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌱 Seeding initial data..." -ForegroundColor Yellow
npx prisma db seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Data seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to seed data!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Login credentials:" -ForegroundColor Cyan
Write-Host "   Email: admin@mialamin.sch.id"
Write-Host "   Password: admin123"
Write-Host ""
Write-Host "🌐 Test at: https://madrasahalamin.vercel.app/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ You can now login to your application!" -ForegroundColor Green
