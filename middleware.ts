import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const publicRoutes = ['/', '/forgot-password', '/login'];

  // Get the authentication token from the request cookies.
  const token = request.cookies.get('accessToken')?.value;

  const pathname = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathname);

  console.log(pathname, 'pathname');
  console.log(isPublicRoute, 'isPublicRoute');
  console.log(token, 'token');

  // If the user is authenticated and trying to access a public route,
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not authenticated and trying to access a protected route,
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  console.log('here');

  // If the user is authenticated and trying to access a protected route,
  return NextResponse.next();
}

/**
 * The `config` object specifies which paths the middleware should run on.
 * The `matcher` property ensures the middleware runs on all paths
 * except for API routes, static files, and internal Next.js paths.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2)).*)',
  ],
};
