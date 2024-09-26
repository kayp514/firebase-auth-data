// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth/authService';
import { generateToken } from '@/auth/tokenService';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    const user = await signIn(email, password);
    const token = await generateToken(user.user.uid);
    return NextResponse.json({ token, user: { uid: user.user.uid, email: user.user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}