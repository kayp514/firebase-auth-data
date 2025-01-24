// app/actions/auth.ts
'use client'

import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword, 
  sendEmailVerification } from 'firebase/auth';
import { clientAuth } from '@/app/lib/firebaseClient'
import { createSessionCookie } from '../lib/authServer';


export async function createUser(email: string, password: string) {
  try {
    
    const actionCodeSettings = {
      url: `${window.location.origin}/sign-in`,
      handleCodeInApp: true
    };

    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);

    await sendEmailVerification(userCredential.user, actionCodeSettings)
    
    return { success: true, message: 'Account created successfully.', user: userCredential.user };

  } catch (error) {
    // Handle specific Firebase auth errors
    if (error instanceof Error) {
      switch (error.message) {
        case 'auth/email-already-in-use':
          throw new Error('Email is already registered.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled.');
        case 'auth/weak-password':
          throw new Error('Password is too weak.');
        default:
          throw new Error(error.message);
      }
    }
    throw new Error('Failed to create account');
  }
}

export async function signInWithEmail(email: string, password: string){

  try {
  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password)

  if (!userCredential.user.emailVerified) {
    throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
  }

  const idToken = await userCredential.user.getIdToken();

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
  provider.addScope('https://www.googleapis.com/auth/userinfo.email')
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  provider.setCustomParameters({
    login_hint: 'user@example.com',
    prompt: 'select_account',
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


export async function checkEmailVerification(user: any) {
  try {
    // Force refresh the token
    await user.reload();
    return user.emailVerified;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
}


export async function resendEmailVerification(user: any) {
  try {
    // Force refresh the token
    await user.reload();
    return user.emailVerified;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
}