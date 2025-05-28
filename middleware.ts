import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/login', '/register', '/'];

// Add static asset paths that should be accessible
const staticPaths = ['/favicon.svg', '/placeholder.svg', '/placeholder-logo.png', '/placeholder-logo.svg', '/placeholder-user.jpg', '/placeholder.jpg'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // For protected routes, we'll let the client-side handle the auth check
    // This is because we can't access localStorage in middleware
    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 