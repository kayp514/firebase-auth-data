// src/app/api/auth/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/auth/tokenService';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 10, 60000)) { // 10 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const result = await verifyToken(token);
    if (result) {
      return NextResponse.json({ valid: true, uid: result.uid });
    } else {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}