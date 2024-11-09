// app/api/admin/getClientSecret/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
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

    const { appId } = await request.json();

    if (!appId) {
      return NextResponse.json({ error: 'Missing appId' }, { status: 400 });
    }

    const secretDocRef = adminDb.collection('appSecrets').doc(appId);
    const secretDoc = await secretDocRef.get();

    if (!secretDoc.exists) {
      return NextResponse.json({ error: 'Client secret not found' }, { status: 404 });
    }

    const data = secretDoc.data();
    if(!data?.clientSecret) {
      return NextResponse.json({ error: 'Client secret not found' }, { status: 404 });
    }

    const clientSecret = data.clientSecret;
    console.log("Client Secret:", clientSecret)

    return NextResponse.json({ clientSecret }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving client secret:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}