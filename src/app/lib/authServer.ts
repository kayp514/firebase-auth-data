// app/lib/auth.server.ts
'use server'

import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';

export interface User {
    uid: string;
    email: string;
  }

export interface Session {
    user: User;
    token: string;
  }

export async function setServerSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
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
    return { 
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email || ''
      },
      token: token
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'auth/id-token-expired') {
      console.error('Token has expired:', error);
      await clearServerSession();
    } else {
      console.error('Error verifying token:', error);
    }
    return null;
  }
}

export async function clearServerSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}