// app/api/auth/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/app/lib/firebaseAdmin';
import { FirebaseError } from 'firebase/app';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Fetch user data from Firebase Authentication
    const userRecord = await adminAuth.getUser(uid);

    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      phoneNumber: userRecord.phoneNumber,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/id-token-expired':
          return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        case 'auth/user-not-found':
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        case 'auth/argument-error':
          return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
        default:
          return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}