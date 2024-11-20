import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'




const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


export async function middleware(request: NextRequest) {

    const isLoginPage = request.nextUrl.pathname === '/login';
    const isSignup = request.nextUrl.pathname === '/signup';
    const isPublicRoute = isLoginPage || isSignup ;


    if (isPublicRoute) {
      return NextResponse.next();
    }



  return NextResponse.next();
}