// pages/api/login/route.ts (in the authentication system)

import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '@/app/lib/firebaseClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callback');
  const redirectUrl = searchParams.get('redirect');

  if (!callbackUrl) {
    return NextResponse.json({ error: 'Callback URL is required' }, { status: 400 });
  }

  // Here, instead of immediately redirecting, we'll render a login form
  // This is a simple HTML form, you might want to use a more sophisticated UI in production
  const loginForm = `
    <form id="loginForm" method="POST">
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="hidden" name="callback" value="${callbackUrl}">
      <input type="hidden" name="redirect" value="${redirectUrl || ''}">
      <button type="submit">Log In</button>
    </form>
    <script>
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const response = await fetch('/api/login', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          window.location.href = data.redirectUrl;
        } else {
          alert('Login failed. Please try again.');
        }
      });
    </script>
  `;

  return new NextResponse(loginForm, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callback') as string;
  const redirectUrl = formData.get('redirect') as string;

  if (!email || !password || !callbackUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const finalRedirectUrl = `${callbackUrl}?token=${token}&redirect=${redirectUrl || ''}`;

    return NextResponse.json({ redirectUrl: finalRedirectUrl });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}