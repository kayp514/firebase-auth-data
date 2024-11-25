import { NextResponse } from 'next/server'

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'http://localhost:3000'



export async function POST(request: Request) {
  try {
    // Test both local and full URL to demonstrate routing
    const fullUrlPromise = fetch('https://api.ternsecure.com/auth/ver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TernSecure-Server/1.0',
      },
      body: JSON.stringify({ test: 'full-url' })
    });

    const relativeUrlPromise = fetch(`${AUTH_APP_URL}/api/auth/ver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TernSecure-Server/1.0',
      },
      body: JSON.stringify({ test: 'relative-url' })
    });

    const [fullUrlResponse, relativeUrlResponse] = await Promise.all([fullUrlPromise, relativeUrlPromise]);

    const fullUrlData = await fullUrlResponse.text();
    const relativeUrlData = await relativeUrlResponse.text();

    let fullUrlJson, relativeUrlJson;

    try {
      fullUrlJson = JSON.parse(fullUrlData);
    } catch (error) {
      fullUrlJson = { error: 'Failed to parse JSON', rawResponse: fullUrlData };
    }

    try {
      relativeUrlJson = JSON.parse(relativeUrlData);
    } catch (error) {
      relativeUrlJson = { error: 'Failed to parse JSON', rawResponse: relativeUrlData };
    }

    return NextResponse.json({
      success: true,
      fullUrlTest: {
        status: fullUrlResponse.status,
        statusText: fullUrlResponse.statusText,
        headers: Object.fromEntries(fullUrlResponse.headers),
        data: fullUrlJson
      },
      relativeUrlTest: {
        status: relativeUrlResponse.status,
        statusText: relativeUrlResponse.statusText,
        headers: Object.fromEntries(relativeUrlResponse.headers),
        data: relativeUrlJson
      }
    });
  } catch (error) {
    console.error('Error testing API routing:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test API routing',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// Implement other HTTP methods to prevent method not allowed errors
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

