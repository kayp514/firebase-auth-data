import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { setCorsHeaders } from '@/lib/securityUtils';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.next();
    setCorsHeaders(response);

    // Verify authentication
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
      await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (appId) {
      // Fetch a specific app by ID
      const appDoc = await adminDb.collection('callbackUrl').doc(appId).get();
      
      if (!appDoc.exists) {
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }

      const app = {
        id: appDoc.id,
        ...appDoc.data()
      };

      return NextResponse.json({ app }, { status: 200 });
    } else {

    // Fetch registered apps from Firestore
    const appsSnapshot = await adminDb.collection('registeredApps').get();
    const apps = appsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ apps }, { status: 200 });
  }
  } catch (error) {
    console.error('Error fetching registered apps:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}