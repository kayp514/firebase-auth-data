import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'ternsecure.com'
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
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

  // Check if the request is from a browser
  const userAgent = request.headers.get('user-agent') || ''
  const isBrowser = userAgent.includes('Mozilla') || 
                    userAgent.includes('Chrome') || 
                    userAgent.includes('Safari') ||
                    userAgent.includes('AppleWebKit')

  // First, check for API subdomain
  if (hostname.startsWith('api.')) {
    console.log('API subdomain access:', hostname)
    
    // Block browser access to API subdomain
    if (isBrowser) {
      console.log('Blocking browser access to API subdomain')
      return new NextResponse(null, { 
        status: 404,
        statusText: 'Not Found',
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    }
    
    return NextResponse.next()
  }

  // Then handle main domain auth check - make sure we're exactly matching the main domain
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Allow all other requests (other subdomains)
  return NextResponse.next()
}

