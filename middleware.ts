import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/', '/login', '/register', '/api/v1/auth/login', '/api/v1/auth/register'];

// Add static asset paths that should be accessible
const staticPaths = ['/favicon.svg', '/placeholder.svg', '/placeholder-logo.png', '/placeholder-logo.svg', '/placeholder-user.jpg', '/placeholder.jpg'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is public or static
    if (publicPaths.includes(pathname) || staticPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Get the token from the cookies
    const token = request.cookies.get('jwtToken')?.value;

    // If there's no token, redirect to login
    if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}; 