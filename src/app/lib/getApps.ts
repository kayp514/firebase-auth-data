//lib/getApps

import { cache } from 'react'

export const getApps = cache(async (session: any, appId?: string) => {
  const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'http://localhost:3000';
  
  const queryParam = appId 
    ? `appId=${appId}`
    : `userId=${session.user.uid}`;

  const response = await fetch(`${AUTH_APP_URL}/api/admin/getRegisteredApps?${queryParam}`, {
    headers: {
      'Authorization': `Bearer ${session.token}`
    },
    next: {
      tags: ['apps'],
      revalidate: 60 // Revalidate every 60 seconds
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch apps')
  }

  return response.json()
})