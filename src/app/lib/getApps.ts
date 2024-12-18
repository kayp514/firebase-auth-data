// app/lib/getApps.ts
'use server'
import { cache } from 'react'
import { cookies } from 'next/headers';
import { handleAuthError } from '@/auth/errorHandling'

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'https://ternsecure.com';


export const getApps = cache(async (appId?: string) => {

  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('_session_cookie')?.value;

    if (!token) {
      return { error: 'Not authenticated' }
    }

    const queryParam = appId ? `appId=${appId}` : ''

    const response = await fetch(`${AUTH_APP_URL}/api/admin/getRegisteredApps?${queryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: {
        tags: ['apps'],
        revalidate: 60
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch apps')
    }

    return response.json()
  } catch (error) {
    console.error('Error in getApps:', error);
    const { message } = handleAuthError(error);
    return { error: message };
  }
})