# Authentication Implementation

## Overview
Authentication menggunakan NextAuth.js v5 dengan Credentials Provider dan bcrypt untuk password hashing.

## Features Implemented
✅ Login dengan email dan password  
✅ Session management dengan JWT  
✅ Route protection dengan middleware  
✅ Role-based access control  
✅ Logout functionality  
✅ User session display di header  
✅ Password hashing dengan bcrypt  
✅ Last login tracking  
✅ Inactive user blocking  

## Configuration Files
- `src/lib/auth.ts` - NextAuth instance
- `src/lib/auth.config.ts` - NextAuth configuration & credentials provider
- `src/middleware.ts` - Route protection middleware
- `src/types/next-auth.d.ts` - TypeScript type definitions
- `src/lib/auth-helpers.ts` - Helper functions untuk auth
- `src/app/api/auth/[...nextauth]/route.ts` - API route handler

## Demo Accounts
```
Super Admin:
Email: admin@mialamin.sch.id
Password: admin123

Guru:
Email: guru@mialamin.sch.id
Password: admin123
```

## Usage Examples

### Protect Routes (Server Components)
```typescript
import { requireAuth, requireRole } from '@/lib/auth-helpers';

// Require authentication
export default async function Page() {
  await requireAuth();
  return <div>Protected content</div>;
}

// Require specific role
export default async function AdminPage() {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  return <div>Admin only content</div>;
}
```

### Get Session (Server Components)
```typescript
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  return <div>Welcome, {session?.user?.name}</div>;
}
```

### Get Session (Client Components)
```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();
  return <div>Welcome, {session?.user?.name}</div>;
}
```

### Login
```typescript
'use client';
import { signIn } from 'next-auth/react';

const handleLogin = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });
  
  if (result?.error) {
    console.error('Login failed');
  } else {
    router.push('/dashboard');
  }
};
```

### Logout
```typescript
'use client';
import { signOut } from 'next-auth/react';

const handleLogout = async () => {
  await signOut({ redirect: false });
  router.push('/login');
};
```

## Environment Variables
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

## Security Features
- Password hashing dengan bcrypt (10 rounds)
- JWT token untuk session management
- Secure cookie settings (httpOnly, sameSite)
- Route protection dengan middleware
- Role-based access control (SUPER_ADMIN, ADMIN, TEACHER, PARENT, STUDENT)
- Inactive user blocking (isActive field)
- Last login tracking untuk audit
- Automatic redirect untuk unauthorized access

## Testing
1. Buka http://localhost:3000/login
2. Login dengan demo account (admin@mialamin.sch.id / admin123)
3. Verify redirect ke dashboard
4. Check user info di header (nama dan role)
5. Test logout functionality
6. Verify redirect ke login page
7. Try accessing /dashboard without login (should redirect to /login)
8. Try accessing /dashboard/settings with non-admin role (should redirect to /dashboard)

## Implementation Complete
Authentication sudah fully implemented dan terintegrasi dengan:
- Login page dengan form validation
- Dashboard layout dengan SessionProvider
- Header component dengan user display dan logout
- Middleware untuk route protection
- Role-based access control di settings page
- Welcome message dengan nama user di dashboard

Build successful! ✅

