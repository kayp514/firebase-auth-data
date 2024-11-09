// app/api/auth/login/route.ts (in the authentication system)

import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '@/app/lib/firebaseClient';
import { adminDb } from '@/app/lib/firebaseAdmin';
import { createHash, timingSafeEqual } from 'crypto';

export async function POST(request: NextRequest) {

const { email, password, callbackUrl, redirectUrl, appId, clientSecret } = await request.json();

  if (!email || !password || !callbackUrl || !appId || !clientSecret)  {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const appDoc = await adminDb.collection('registeredApps').doc(appId).get();
    console.log('App Doc exists:', appDoc.exists)
    if (!appDoc.exists) {
      console.log('appDoc exists:', appDoc.exists)
      return NextResponse.json({ error: 'Invalid app credentials' }, { status: 401 });
    }

    const appData = appDoc.data();
    const storedHashBuffer = Buffer.from(appData?.clientSecretHash, 'hex');
    const receivedHashBuffer = createHash('sha256').update(clientSecret).digest();

    if (!timingSafeEqual(receivedHashBuffer, storedHashBuffer)) {
      console.log('Invalid client secret');
      return NextResponse.json({ error: 'Invalid app credentials' }, { status: 401 });
    }

    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const finalRedirectUrl = `${callbackUrl}?token=${token}&redirect=${redirectUrl || ''}&appId=${appId}`;

    return NextResponse.json({ redirectUrl: finalRedirectUrl });
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}