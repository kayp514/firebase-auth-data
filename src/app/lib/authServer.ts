// app/lib/authServer.ts
'use server'

import { cookies } from 'next/headers';
import { adminAuth } from './firebaseAdmin';


export interface User {
    uid: string;
    email: string;
  }

export interface Session {
    user: User | null;
    token: string | null;
    error: Error | null;
}

export async function createSessionCookie(idToken: string) {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

      const cookieStore = await cookies();
      cookieStore.set('_session_cookie', sessionCookie, {
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
      });
      console.log('createsessioncookies function token:', sessionCookie)
      return { success: true, message: 'Session created' };
  } catch (error) {
      console.error('Session creation error:', error);
      return { success: false, message: 'Failed to create session' };
  }
}


export async function setServerSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
}


export async function getServerSessionToken() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('No session cookie found')
  }
    
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    return {
      token: sessionCookie,
    }
  } catch (error) {
    console.error('Error verifying session:', error)
    throw new Error('Invalid Session')
  }
}


export async function getIdToken() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    throw new Error('No session cookie found')
  }
    
  try {
    const decodedClaims = await adminAuth.verifyIdToken(sessionCookie)
    return {
      token: sessionCookie,
      userId: decodedClaims.uid
    }
  } catch (error) {
    console.error('Error verifying session:', error)
    throw new Error('Invalid Session')
  }
}



/*
  export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value
  
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 })
    }
  
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
      return NextResponse.json({ isAuthenticated: true, user: decodedClaims }, { status: 200 })
    } catch (error) {
      console.error('Error verifying session cookie:', error)
      return NextResponse.json({ isAuthenticated: false }, { status: 401 })
    }
  }

*/
