#!/bin/bash

# Deploy to Vercel Script
# This script helps you deploy the application to Vercel

echo "🚀 MI Al-Amin - Vercel Deployment Script"
echo "=========================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""

# Ask deployment type
echo "Select deployment type:"
echo "1) Preview (for testing)"
echo "2) Production"
read -p "Enter choice (1 or 2): " choice

echo ""
echo "📋 Pre-deployment checklist:"
echo "1. ✅ Build test passed"
echo "2. ⚠️  Database migrations ready"
echo "3. ⚠️  Environment variables configured in Vercel"
echo ""

read -p "Continue with deployment? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Deployment cancelled"
    exit 0
fi

echo ""
echo "🔨 Starting deployment..."
echo ""

if [ "$choice" = "2" ]; then
    echo "🚀 Deploying to PRODUCTION..."
    vercel --prod
else
    echo "🔍 Deploying to PREVIEW..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Run database migrations (if first deploy):"
echo "   npx prisma migrate deploy"
echo ""
echo "2. Seed initial data:"
echo "   npx prisma db seed"
echo ""
echo "3. Test the application:"
echo "   - Login with: admin@mialamin.sch.id / admin123"
echo "   - Test all CRUD operations"
echo "   - Test export functionality"
echo ""
echo "🎉 Happy deploying!"
