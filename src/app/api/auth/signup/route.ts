import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/app/lib/firebaseClient";
import { rateLimit, setCorsHeaders } from '@/lib/securityUtils';

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  setCorsHeaders(response);

  if (!rateLimit(request, 5, 60000)) { // 5 requests per minute
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;

    return NextResponse.json({
      success: true,
      uid: user.uid,
      message: "User created successfully"
    });

  } catch (error: any) {
    console.error("Signup error:", error);

    if (error?.code === 'auth/email-already-in-use') {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}