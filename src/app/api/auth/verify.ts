// src/app/api/auth/verify.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { verifyAuthentication } from '../../../auth/authService';
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

  if (!rateLimit(req, res, 10, 60000)) { // 10 requests per minute
    return;
  }

  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Token is required' });
    return;
  }

  try {
    const isValid = await verifyAuthentication(token);
    if (isValid) {
      res.status(200).json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
}