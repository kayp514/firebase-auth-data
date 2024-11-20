// app/actions/auth.ts
'use client'

import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '@/app/lib/firebaseClient'
import { handleAuthError } from '@/auth/errorHandling';
import { createSessionCookie } from '../lib/authServer';


export async function login(email: string, password: string) {
  try {

    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const res = await createSessionCookie(idToken);
    if (res.success) {
    return { success: true, message: 'Connected.' };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    return handleAuthError(error);
  }
}
