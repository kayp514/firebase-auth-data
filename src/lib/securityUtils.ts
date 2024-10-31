import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// In-memory store for rate limiting
// Note: In production, use Redis or a similar solution
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export function setCorsHeaders(response: NextResponse): NextResponse {
  // Create a new response with the CORS headers
  const newResponse = NextResponse.next({
    request: {
      headers: new Headers(response.headers),
    },
  });

  // Set CORS headers
  newResponse.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  newResponse.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return newResponse;
}

export function rateLimit(request: NextRequest, limit: number, windowMs: number): boolean {
  // Get client IP address from headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.timestamp < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  // Get current rate limit data for this IP
  const currentLimit = rateLimitStore.get(clientIp);
  
  if (!currentLimit) {
    // First request from this IP
    rateLimitStore.set(clientIp, { count: 1, timestamp: now });
    return true;
  }
  
  if (currentLimit.timestamp < windowStart) {
    // Reset if outside window
    rateLimitStore.set(clientIp, { count: 1, timestamp: now });
    return true;
  }
  
  if (currentLimit.count >= limit) {
    // Rate limit exceeded
    return false;
  }
  
  // Increment counter
  rateLimitStore.set(clientIp, {
    count: currentLimit.count + 1,
    timestamp: currentLimit.timestamp
  });
  
  return true;
}

// Helper function to create a standardized error response
export function createErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json(
    { error: message },
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
}