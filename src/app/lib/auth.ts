//lib/auth.ts

import { clientAuth } from './firebaseClient';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';

export async function signIn(email: string, password: string): Promise<{ user: User, token: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(clientAuth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}