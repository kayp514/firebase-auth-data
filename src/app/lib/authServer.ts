// app/lib/authServer.ts
'use server'

import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';
import { FirebaseError } from 'firebase-admin/app';

export interface User {
    uid: string;
    email: string;
  }

export interface Session {
    user: User;
    token: string;
    tokenDetails: {
        issuedAt: Date;
        expiresAt: Date;
    };
}

export async function setServerSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    console.log('No token found in getServerSession');
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)

    const expirationTime = new Date(decodedToken.exp * 1000);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;

    if (expirationTime.getTime() - now.getTime() < fiveMinutes) {
        console.log('Token is about to expire, clearing session');
        return null;
    }
    return { 
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email || ''
      },
      token: token,
      tokenDetails: {
        issuedAt: new Date(decodedToken.iat * 1000),
        expiresAt: new Date(decodedToken.exp * 1000)
      }
    };
} catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/id-token-expired' || firebaseError.code === 'auth/id-token-revoked') {
            console.error('Token has expired or been revoked:', firebaseError);
        } else {
            console.error('Error verifying token:', error);
        }
    } else {
        console.error('Unexpected error:', error);
    }
    return null;
}
}


export async function clearServerSession() {
    return (await cookies()).set('auth_token', 'value', { maxAge: 0 })
  }