// app/api/admin/registerApp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { randomBytes, createHash } from 'crypto';
import DOMPurify from 'isomorphic-dompurify';
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

const MAIN_DOMAIN = 'ternsecure.com';

function generateSubdomain(appName: string): string {
  // Remove non-alphanumeric characters and convert to lowercase
  const sanitized = appName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  // Take the first 10 characters (or less if the name is shorter)
  const prefix = sanitized.slice(0, 10);
  // Add a random suffix
  const suffix = randomBytes(4).toString('hex');
  return `${prefix}-${suffix}`;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

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
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token)
    } catch (error) {
      console.error('Error verifying token:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json();
    console.log("Request body:", body);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { appName } = body;

    if (!appName || typeof appName !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing appName' }, { status: 400 });
    }

    const sanitizedAppName = DOMPurify.sanitize(body.appName);
    const appId = randomBytes(16).toString('hex');
    const clientSecret = randomBytes(32).toString('hex');
    const subdomain = generateSubdomain(sanitizedAppName);
    const defaultDomain = `${subdomain}.${MAIN_DOMAIN}`;

    const appData = {
      appId,
      appName: sanitizedAppName,
      clientSecretHash: createHash('sha256').update(clientSecret).digest('hex'),
      defaultDomain,
      mainDomain: MAIN_DOMAIN,
      createdAt: new Date().toISOString(),
      userId: decodedToken.uid
    };

    try {
      const appDocRef = adminDb.collection('registeredApps').doc(appId);
      await appDocRef.set(appData);

      const secretDocRef = adminDb.collection('appSecrets').doc(appId);
      await secretDocRef.set({
        clientSecret: clientSecret,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ 
        message: 'App registered successfully',
        appId,
        clientSecret,
        defaultDomain,
        mainDomain: MAIN_DOMAIN,
        subdomain
      }, { status: 201 });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Firebase error:', error.message);
        return NextResponse.json({ error: `Firebase operation failed: ${error.message}` }, { status: 500 });
      } else {
        console.error('Unknown error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during database operation' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error registering app:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}