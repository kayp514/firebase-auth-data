export async function verifyToken(token: string, origin: string) {
    try {
      const response = await fetch(`${origin}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-request': 'true',
        },
        body: JSON.stringify({ token }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to verify token');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Token verification failed:', error);
      return { valid: false, error: 'Invalid token' };
    }
  }