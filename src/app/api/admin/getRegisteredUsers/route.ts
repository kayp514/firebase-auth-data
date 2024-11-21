//app/api/admin/getRegisterApps.tsx

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
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifySessionCookie(token);
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 });
    }

    // List all users (with pagination for large datasets)
    const listUsersResult = await adminAuth.listUsers(1000);
    
    // Filter users by custom claim
    const registeredUsers = listUsersResult.users
      .filter(user => {
        const customClaims = user.customClaims || {};
        //console.log('User:', user.email, 'Claims:', customClaims);
        return customClaims.appId === appId
      })
      .map(user => ({
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        metadata: user.metadata,
        customClaims: {
          appId: user.customClaims?.appId,
          admin: user.customClaims?.admin
        }
      }));

      console.log('Sending users:', registeredUsers);

    return NextResponse.json({ registeredUsers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}