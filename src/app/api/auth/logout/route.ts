// src/app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/auth/authService';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    await signOut();
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}