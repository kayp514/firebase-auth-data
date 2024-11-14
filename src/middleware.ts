import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: NextRequest) {
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isSignup = request.nextUrl.pathname === '/signup';

    const token = request.cookies.get('auth_token')

    // Allow access to login, signup, and root pages without authentication
    if (isLoginPage || isSignup) {
      return NextResponse.next();
    }

    if (!token) {
      console.log('No token found in middleware, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url))
    }

}