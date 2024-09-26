// src/utils/securityUtils.ts

import { NextApiRequest, NextApiResponse } from 'next';

export function setCorsHeaders(res: NextApiResponse): void {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function rateLimit(req: NextApiRequest, res: NextApiResponse, limit: number, windowMs: number): boolean {
  // Implement rate limiting logic here
  // This is a simplified example and should be replaced with a proper rate limiting library in production
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - windowMs;

  // In a real implementation, you'd use a database or in-memory store to track requests
  // This is just a placeholder
  const requestCount = 0; // Replace with actual count from your store

  if (requestCount > limit) {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
    return false;
  }

  return true;
}