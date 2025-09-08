import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/forgot-password', '/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  const pathname = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathname);

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2)).*)',
  ],
};
