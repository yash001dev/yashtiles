import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
  
  // Add robots headers for all responses in non-production environments
  if (!isProduction) {
    const response = NextResponse.next();
    
    // Add X-Robots-Tag header to prevent indexing
    response.headers.set(
      'X-Robots-Tag',
      'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache'
    );
    
    // Add additional meta tag for extra protection
    response.headers.set(
      'X-Environment-Protection',
      'development-staging-no-index'
    );
    
    return response;
  }
  
  return NextResponse.next();
}

// Apply middleware to all routes
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
