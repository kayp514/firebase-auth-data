// app/api/admin/registerApp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    console.log("Request Headers:", request.headers);
    const authHeader = request.headers.get('Authorization')
    console.log("Auth Header:", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split('Bearer ')[1]
    console.log("API Route - Token:", token);
    try {
      await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('Error verifying token:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json();

    const appName = body.appName;

    if (!appName || typeof appName !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing appName' }, { status: 400 });
    }

    const appId = nanoid(16); // Generate a unique appId

    const appData = {
      appId,
      appName,
      createdAt: new Date().toISOString(),
    };

    try {
      const appDocRef = adminDb.collection('registeredApps').doc();
      await appDocRef.set(appData);

      return NextResponse.json({ 
        message: 'App registered successfully',
        appId,
        appDocId: appDocRef.id
      }, { status: 201 });
    } catch (firebaseError) {
      console.error('Firebase error:', firebaseError);
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error registering app:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}