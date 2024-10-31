// app/api/external/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/app/lib/firebaseAdmin';
import { signUpExternalUser } from '@/app/actions/user';

export async function POST(request: NextRequest) {
  try {
    const { email, password, appId, redirectUrl } = await request.json();
    
    if (!appId || !redirectUrl) {
      return NextResponse.json({ error: 'Missing appId or redirectUrl' }, { status: 400 });
    }

    // Verify the appId
    const appSnapshot = await adminDb.collection('registeredApps').where('appId', '==', appId).get();

    if (appSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid appId' }, { status: 400 });
    }

    // Verify the redirectUrl using Google Cloud Identity Platform
    try {
      await adminAuth.generateSignInWithEmailLink(email, {
        url: redirectUrl,
        handleCodeInApp: true,
      });
    } catch (error) {
      console.error('Error verifying redirect URL:', error);
      return NextResponse.json({ error: 'Invalid redirectUrl' }, { status: 400 });
    }

    const result = await signUpExternalUser(email, password, appId);

    if (result.success) {
      const successUrl = new URL(redirectUrl);
      successUrl.searchParams.append('status', 'success');
      successUrl.searchParams.append('email', email);
      return NextResponse.json({ 
        message: 'User registered successfully',
        redirectUrl: successUrl.toString()
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in external signup route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}