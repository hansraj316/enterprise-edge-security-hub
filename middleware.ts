import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic threat detection patterns (simulation)
const SQL_INJECTION_PATTERN = /(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|--|;)/i;
const XSS_PATTERN = /(<script|javascript:|onerror=|onload=)/i;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Skip middleware for static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // 1. Analyze for SQL Injection in query params
  if (SQL_INJECTION_PATTERN.test(search)) {
    console.warn(`[EdgeShield] Blocked potential SQL Injection: ${pathname}${search}`);
    return new NextResponse(
      JSON.stringify({ error: 'Security block: Malicious payload detected', code: 'SQLI_DETECTED' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  // 2. Analyze for XSS in query params
  if (XSS_PATTERN.test(search)) {
    console.warn(`[EdgeShield] Blocked potential XSS: ${pathname}${search}`);
    return new NextResponse(
      JSON.stringify({ error: 'Security block: Malicious payload detected', code: 'XSS_DETECTED' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    );
  }

  // 3. Add security headers
  const response = NextResponse.next();
  response.headers.set('X-EdgeShield-Protected', 'true');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
