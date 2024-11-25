import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'ternsecure.com'
const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { hostname, pathname } = url
  console.log('Middleware:', hostname, pathname)
  
  // Define public routes
  const isLoginPage = pathname === '/login'
  const isSignup = pathname === '/signup'
  const isPublicRoute = isLoginPage || isSignup

  // First, strictly check for API subdomain
  if (hostname.startsWith('api.')) {
    console.log('Blocking API subdomain access:', hostname)
    return new NextResponse(null, { 
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }

  // Then handle main domain auth check - make sure we're exactly matching the main domain
  if (hostname === MAIN_DOMAIN && !isPublicRoute) {
    console.log('Main domain auth check:', hostname)
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow all other requests (other subdomains)
  return NextResponse.next()
}

