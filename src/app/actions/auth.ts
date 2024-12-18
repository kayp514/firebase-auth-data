// app/actions/auth.ts
'use client'

import { signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { clientAuth } from '@/app/lib/firebaseClient'
import { handleAuthError } from '@/auth/errorHandling';
import { createSessionCookie } from '../lib/authServer';


export async function signInWithEmail(email: string, password: string){

  try {
  const UserCredential = await signInWithEmailAndPassword(clientAuth, email, password)
  const idToken = await UserCredential.user.getIdToken();

  const res = await createSessionCookie(idToken);

  if(res.success) {
    return { success: true, message: 'Connected.' };
  } else {
    throw new Error(res.message);
  }
} catch (error){
  const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
  throw new Error(errorMessage);
}
}

export async function signInWithRedirectGoogle() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    login_hint: 'user@example.com',
    prompt: 'select_account',
    redirectUrl: 'https://ternsecure.com/auth/callback',
    continue_uri: 'https://ternsecure.com/auth/callback'
  })  

  try {
    await signInWithRedirect(clientAuth, provider)
    return { success: true, message: 'Redirect initiated' }
  } catch (error) {
    console.error('Error during Google sign-in:', error)
    return { success: false, error: 'Failed to sign in with Google' }
  }
}


export async function signInWithMicrosoft() {
  const provider = new OAuthProvider('microsoft.com')
  provider.setCustomParameters({
    prompt: 'consent'
  })

  try {
    await signInWithRedirect(clientAuth, provider)
    return { success: true, message: 'Redirect initiated' }
  } catch (error) {
    console.error('Error during Google sign-in:', error)
    return { success: false, error: 'Failed to sign in with Google' }
  }
}


export async function handleAuthRedirectResult() {
  try {
    const result = await getRedirectResult(clientAuth)
    if (result) {
      const user = result.user
      return { success: true, user }
    } else {
      return { success: false, error: 'No redirect result' }
    }
  } catch (error: any) {
    console.error('Error handling auth redirect result:', error)
    return { success: false, error: error.message || 'Failed to handle auth redirect', code: error.code }
  }
}