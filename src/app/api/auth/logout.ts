// src/app/api/auth/logout.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { signOut } from '../../../auth/authService';
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

  try {
    await signOut();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
}