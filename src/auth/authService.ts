// src/auth/authService.ts

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { clientAuth } from '../app/lib/firebaseClient';
import { adminAuth, adminDb } from '../app/lib/firebaseAdmin';
import { handleAuthError } from './errorHandling';

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    return userCredential.user;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export async function signUpUser(email: string, password: string, appId?: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;

    await adminDb.collection('users').doc(user.uid).set({
      email: user.email,
      appId: appId || 'internal',
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error signing up user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create account' };
  }
}

export async function signIn(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const token = await adminAuth.createCustomToken(userCredential.user.uid);
    return { token, user: userCredential.user };
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(clientAuth);
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
}

export async function verifyAuthentication(token: string): Promise<boolean> {
  try {
    await adminAuth.verifyIdToken(token);
    return true;
  } catch (error) {
    handleAuthError(error);
    return false;
  }
}