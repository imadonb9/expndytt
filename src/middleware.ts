import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple UUID v4 implementation without dependencies
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// TODO: replace this with the upcoming stack auth anonymous user and transition existing cookies to it. 
// https://github.com/stack-auth/stack-auth/issues/639
export function middleware(req: NextRequest) {
  const COOKIE_NAME = 'anonId';
  const existing = req.cookies.get(COOKIE_NAME)?.value;
  const res = NextResponse.next();

  if (!existing) {
    // generate and persist for 1 year
    res.cookies.set(COOKIE_NAME, generateUUID(), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } else {
    // extend existing cookie for 1 year
    res.cookies.set(COOKIE_NAME, existing, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return res;
}

// Define paths middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};