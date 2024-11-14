// app/api/admin/manageCallbacks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';


export async function GET(request: NextRequest) {
  try {
    // Extract the appId from the query parameters
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken);

    // Fetch callbacks for the given appId
    const callbacksSnapshot = await adminDb.collection('appCallbacks')
      .where('appId', '==', appId)
      .get();

    const callbacks = callbacksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ callbacks });
  } catch (error) {
    console.error('Error fetching callbacks:', error);
    return NextResponse.json({ error: 'Failed to fetch callbacks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('Error verifying token:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { appId, callbackUrl } = body;

    if (!appId || typeof appId !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing appId' }, { status: 400 });
    }

    if (!callbackUrl || typeof callbackUrl !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing callbackUrl' }, { status: 400 });
    }

    // Validate the callback URL format

    const isWildcard = callbackUrl.includes('*');

    const callbackUrlData = {
      appId,
      callbackUrl,
      isWildcard,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: decodedToken.uid
    }

    try {
      const appDocRef = await adminDb.collection('appCallbacks').doc(appId);
      await appDocRef.set(callbackUrlData );

      return NextResponse.json({ message: 'Callback URL added successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error adding callback URL:', error);
      return NextResponse.json({ error: 'Failed to add callback URL' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing callback addition:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  // ... (authentication and validation)

  const { appId, callbackUrl } = await request.json();

  try {
    const callbackRef = await adminDb.collection('appCallbacks')
      .where('appId', '==', appId)
      .where('callbackUrl', '==', callbackUrl)
      .limit(1)
      .get();

    if (callbackRef.empty) {
      return NextResponse.json({ error: 'Callback URL not found' }, { status: 404 });
    }

    await callbackRef.docs[0].ref.delete();

    return NextResponse.json({ message: 'Callback URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting callback URL:', error);
    return NextResponse.json({ error: 'Failed to delete callback URL' }, { status: 500 });
  }
}

function isValidCallbackUrl(url: string): boolean {
  // Implement URL validation logic
  // Allow for wildcard subdomains, e.g., https://*.example.com/callback
  const urlPattern = /^https:\/\/(\*\.)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return urlPattern.test(url);
}