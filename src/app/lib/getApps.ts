// app/lib/getApps.ts
'use server'
import { cache } from 'react'
import { getServerSessionToken } from './authServer'


const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'https://ternsecure.com';

export const getApps = cache(async (appId?: string) => {

  
  try {
    const { token, userId } = await getServerSessionToken()

    const queryParam = appId 
      ? `appId=${appId}`
      : `userId=${userId}`;

    const response = await fetch(`${AUTH_APP_URL}/api/admin/getRegisteredApps?${queryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`
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
  } catch (error) {
    console.error('Error verifying session:', error)
    throw new Error('Invalid Session')
  }
})