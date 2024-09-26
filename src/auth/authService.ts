// src/auth/authService.ts

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { clientAuth } from '../app/lib/firebaseClient';
import { adminAuth } from '../app/lib/firebaseAdmin';
import { logAuthError } from './errorHandling';

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    return userCredential.user;
  } catch (error) {
    logAuthError(error);
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<{ token: string; user: User }> {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const token = await adminAuth.createCustomToken(userCredential.user.uid);
    return { token, user: userCredential.user };
  } catch (error) {
    logAuthError(error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(clientAuth);
  } catch (error) {
    logAuthError(error);
    throw error;
  }
}

export async function verifyAuthentication(token: string): Promise<boolean> {
  try {
    await adminAuth.verifyIdToken(token);
    return true;
  } catch (error) {
    logAuthError(error);
    return false;
  }
}