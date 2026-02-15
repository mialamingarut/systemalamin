#!/bin/bash

# Deploy AL-AMIN School Management System ke Vercel
# Quick deployment script

echo "🚀 AL-AMIN School Management System - Vercel Deployment"
echo "========================================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - ASMS Al-Amin"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "📋 Next steps:"
echo "1. Push code ke GitHub:"
echo "   git remote add origin https://github.com/USERNAME/asms-alamin.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Buat database di Supabase:"
echo "   https://supabase.com/dashboard"
echo "   - Create new project"
echo "   - Copy connection string"
echo ""
echo "3. Deploy ke Vercel:"
echo "   vercel"
echo "   - Follow prompts"
echo "   - Add environment variables"
echo ""
echo "4. Setup database:"
echo "   vercel env pull .env.production"
echo "   npx prisma db push"
echo "   npx prisma db seed"
echo ""
echo "✅ Done! Your site will be live at: https://your-project.vercel.app"
