// src/lib/securityUtils.ts

import { NextRequest, NextResponse } from 'next/server';

export function setCorsHeaders(response: NextResponse): void {
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function rateLimit(request: NextRequest, limit: number, windowMs: number): boolean {
  // Implement rate limiting logic here
  // This is a simplified example and should be replaced with a proper rate limiting library in production
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowStart = now - windowMs;

  // In a real implementation, you'd use a database or in-memory store to track requests
  // This is just a placeholder
  const requestCount = 0; // Replace with actual count from your store

  if (requestCount > limit) {
    return false;
  }

  return true;
}