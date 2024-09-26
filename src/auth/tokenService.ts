// src/auth/tokenService.ts

import { adminAuth } from '@/app/lib/firebaseAdmin';
import { FirebaseError } from 'firebase/app';

export async function generateToken(uid: string): Promise<string> {
  if (!adminAuth) {
    throw new Error('Admin Auth is not initialized');
  }
  try {
    return await adminAuth.createCustomToken(uid);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`Firebase error generating token: ${error.code} - ${error.message}`);
    } else {
      console.error('Unexpected error generating token:', error);
    }
    throw error;
  }
}

export async function verifyToken(token: string): Promise<{ uid: string } | null> {
  if (!adminAuth) {
    throw new Error('Admin Auth is not initialized');
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return { uid: decodedToken.uid };
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`Firebase error verifying token: ${error.code} - ${error.message}`);
    } else {
      console.error('Unexpected error verifying token:', error);
    }
    return null;
  }
}