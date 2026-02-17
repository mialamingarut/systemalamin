import { auth } from '@/lib/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnLogin = req.nextUrl.pathname === '/login';

  // Redirect to login if accessing dashboard without authentication
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to dashboard if accessing login page while already authenticated
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Allow access to landing page and other public pages regardless of auth status
  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
