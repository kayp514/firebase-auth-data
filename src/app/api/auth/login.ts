// src/app/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '../../../auth/authService';
import { setCorsHeaders, rateLimit } from '../../../lib/securityUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!rateLimit(req, res, 5, 60000)) { // 5 requests per minute
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const { token, user } = await signIn(email, password);
    res.status(200).json({ token, user: { uid: user.uid, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}