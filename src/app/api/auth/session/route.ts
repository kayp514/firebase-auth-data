// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server'
import { adminAuth } from '@/app/lib/firebaseAdmin'

export async function POST(request: Request) {
  const { sessionCookie } = await request.json()

  if (!sessionCookie) {
    return NextResponse.json({ isValid: false }, { status: 401 })
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    return NextResponse.json({ isValid: true })
  } catch (error) {
    console.error('Session verification failed:', error)
    return NextResponse.json({ isValid: false }, { status: 401 })
  }
}