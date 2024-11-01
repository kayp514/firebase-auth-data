// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebaseAdmin';
import { signUpExternalUser } from '@/app/actions/user';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}
export async function POST(request: NextRequest) {
  try {
    const { email, password, appId, redirectUrl } = await request.json() as {
      email: string;
      password: string;
      appId: string;
      redirectUrl: string;
    };
    
    if (!appId || !redirectUrl) {
      return NextResponse.json({ error: 'Missing appId or redirectUrl' }, { status: 400 });
    }

    if (!isValidUrl(redirectUrl)) {
      return NextResponse.json({ error: 'Invalid redirectUrl' }, { status: 400 });
    }

    // Verify the appId
    const appSnapshot = await adminDb.collection('registeredApps').where('appId', '==', appId).get();

    if (appSnapshot.empty) {
      return NextResponse.json({ error: 'Invalid appId' }, { status: 400 });
    }

    // Optional: Check if the redirect URL's domain matches the registered app's domain
    // const app = appSnapshot.docs[0].data();
    // const redirectUrlDomain = new URL(redirectUrl).hostname;
    // if (app.allowedDomains && !app.allowedDomains.includes(redirectUrlDomain)) {
    //   return NextResponse.json({ error: 'Redirect URL domain not allowed for this app' }, { status: 400 });
    // }

    const result = await signUpExternalUser(email, password, appId);

    if (result.success) {
      const successUrl = new URL(redirectUrl);
      successUrl.searchParams.append('status', 'success');
      successUrl.searchParams.append('email', email);
      successUrl.searchParams.append('userUuid', result.uid ?? '');
      successUrl.searchParams.append('role', result.role ?? '');
      return NextResponse.json({ 
        message: 'User registered successfully',
        redirectUrl: successUrl.toString(),
        userUuid: result.uid,
        role: result.role
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in external signup route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}