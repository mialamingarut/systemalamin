import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard');
  }
  return session;
}

export function hasRole(userRole: string, allowedRoles: string[]) {
  return allowedRoles.includes(userRole);
}
