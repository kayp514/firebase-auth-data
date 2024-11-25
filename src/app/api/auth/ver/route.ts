import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Log request details to help debug routing
    console.log('Verify endpoint reached:', {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      body
    })

    return NextResponse.json({
      success: true,
      message: 'Verify endpoint reached successfully',
      receivedFrom: body.test
    })
  } catch (error) {
    console.error('Error in verify endpoint:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error processing request'
      }, 
      { status: 500 }
    )
  }
}

// Block all other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

