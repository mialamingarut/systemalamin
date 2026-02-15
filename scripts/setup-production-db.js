#!/usr/bin/env node

/**
 * Script untuk setup database production
 * Jalankan setelah deploy ke Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setup Production Database\n');

// Check if .env.production exists
const envPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env.production tidak ditemukan!');
  console.log('\n📝 Cara membuat .env.production:');
  console.log('1. Jalankan: vercel env pull .env.production');
  console.log('2. Atau copy manual dari Vercel dashboard\n');
  process.exit(1);
}

console.log('✅ File .env.production ditemukan\n');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');

  // Push schema
  console.log('🗄️  Pushing database schema...');
  execSync('npx dotenv -e .env.production -- npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Schema pushed\n');

  // Seed data
  console.log('🌱 Seeding database...');
  execSync('npx dotenv -e .env.production -- npx prisma db seed', { stdio: 'inherit' });
  console.log('✅ Database seeded\n');

  console.log('🎉 Setup selesai!\n');
  console.log('📝 Login credentials:');
  console.log('   Email: admin@mialamin.sch.id');
  console.log('   Password: admin123\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
