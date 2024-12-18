// app/lib/getUsers.ts
'use server'
import { cache } from 'react'
import { cookies } from 'next/headers';
import { handleAuthError } from '@/auth/errorHandling'

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'https://ternsecure.com';


export const getUsers = cache(async (appId?: string) => {

  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('_session_cookie')?.value;

    if (!token) {
      return { error: 'Not authenticated' }
    }

    const queryParam = appId ? `appId=${appId}` : ''

    const response = await fetch(`${AUTH_APP_URL}/api/admin/getRegisteredUsers?${queryParam}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: {
        tags: ['registeredUsers'],
        revalidate: 60
      }
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to fetch users: ${errorData.error || response.statusText}`);
    }

    return response.json()
  } catch (error) {
    console.error('Error in getUsers:', error);
    const { message } = handleAuthError(error);
    return { error: message };
  }
})