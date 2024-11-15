// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers';
import { adminAuth } from '../lib/firebaseAdmin';
import { setServerSession, getServerSession, clearServerSession } from '../lib/authServer';

export async function clearSession() {
    (await cookies()).set('auth_token', 'value', { maxAge: 0 })
  }

export async function refreshServerToken() {
    const session = await getServerSession();
    if (!session) {
        await clearSession();
        return null;
    }
  
    try {
      const newToken = await adminAuth.createCustomToken(session.user.uid);
      await setServerSession(newToken);
      return await getServerSession();
    } catch (error) {
      console.error('Error refreshing token:', error);
      await clearSession();
      return null;
    }
  }

export { setServerSession, getServerSession, clearServerSession };