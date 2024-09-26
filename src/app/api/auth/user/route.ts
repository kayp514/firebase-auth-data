// app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/app/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch user data from your database or Firebase
    // For this example, we'll just return the email from the token
    const userData = {
      uid: uid,
      email: decodedToken.email,
      // Add any other user data you want to include
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function HEAD(request: NextRequest) {
  // Implement HEAD request if needed
  return new NextResponse(null, { status: 200 });
}

export async function OPTIONS(request: NextRequest) {
  // Handle CORS preflight request
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}