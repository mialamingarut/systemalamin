# Push to GitHub Script
# This script helps you push code to GitHub

Write-Host "📦 MI Al-Amin - Push to GitHub" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git not initialized!" -ForegroundColor Yellow
    Write-Host ""
    
    $initGit = Read-Host "Initialize git repository? (y/n)"
    
    if ($initGit -eq "y") {
        Write-Host "🔧 Initializing git..." -ForegroundColor Yellow
        git init
        git branch -M main
        Write-Host "✅ Git initialized!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "❌ Cannot proceed without git" -ForegroundColor Red
        exit
    }
}

# Check if remote exists
$remoteUrl = git remote get-url origin 2>$null

if (-not $remoteUrl) {
    Write-Host "⚠️  No remote repository configured!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please enter your GitHub repository URL:" -ForegroundColor Cyan
    Write-Host "Format: https://github.com/USERNAME/REPO-NAME.git" -ForegroundColor Gray
    $repoUrl = Read-Host "Repository URL"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote added: $repoUrl" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "❌ Repository URL required!" -ForegroundColor Red
        exit
    }
} else {
    Write-Host "✅ Remote repository: $remoteUrl" -ForegroundColor Green
    Write-Host ""
}

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host "📝 Changes detected:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
    
    # Ask for commit message
    Write-Host "Enter commit message:" -ForegroundColor Cyan
    Write-Host "(Press Enter for default message)" -ForegroundColor Gray
    $commitMsg = Read-Host "Message"
    
    if (-not $commitMsg) {
        $commitMsg = "feat: update with latest changes

- Fixed logo display in sidebar
- Fixed redirect issue for logged-in users
- Added error components
- Updated Navbar with user session
- Added deployment scripts
- Ready for production"
    }
    
    Write-Host ""
    Write-Host "🔨 Adding files..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "$commitMsg"
    
    Write-Host "✅ Changes committed!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
    Write-Host ""
}

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

$currentBranch = git branch --show-current

try {
    git push -u origin $currentBranch
    
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
    Write-Host "2. Click 'Add New...' → 'Project'"
    Write-Host "3. Import your GitHub repository"
    Write-Host "4. Add environment variables from .env.vercel"
    Write-Host "5. Deploy!"
    Write-Host ""
    Write-Host "🎉 Auto-deploy will be enabled after connecting to Vercel!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "1. Authentication required - setup GitHub token or SSH key"
    Write-Host "2. Remote branch doesn't exist - first push needs -u flag"
    Write-Host "3. Conflicts - pull changes first: git pull origin $currentBranch"
    Write-Host ""
    Write-Host "📚 See PUSH_TO_GITHUB.md for detailed instructions" -ForegroundColor Cyan
}
