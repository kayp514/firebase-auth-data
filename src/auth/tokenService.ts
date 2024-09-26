// src/auth/tokenService.ts

import { adminAuth } from '@/app/lib/firebaseAdmin';

export async function generateToken(uid: string): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('Token generation is not available on the client side');
  }
  if (!adminAuth) {
    throw new Error('Admin Auth is not initialized');
  }
  return await adminAuth.createCustomToken(uid);
}

export async function verifyToken(token: string): Promise<{ uid: string } | null> {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Token verification is not available on the client side');
    }
    if (!adminAuth) {
      throw new Error('Admin Auth is not initialized');
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}