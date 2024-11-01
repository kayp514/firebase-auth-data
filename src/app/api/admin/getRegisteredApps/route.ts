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

    // Fetch registered apps from Firestore
    const appsSnapshot = await adminDb.collection('registeredApps').get();
    const apps = appsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ apps }, { status: 200 });
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