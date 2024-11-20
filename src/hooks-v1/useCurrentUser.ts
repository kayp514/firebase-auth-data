'use client'

import { User } from "firebase/auth"
import { clientAuth } from "@/app/lib/firebaseClient"
import { useAuth } from './useAuth'

interface CurrentUserState {
  currentUser: User | null
  loading: boolean
  error: Error | null
}

export function useCurrentUser(): CurrentUserState {
  const { isSignedIn, loading: authLoading } = useAuth()

  if (authLoading) {
    return {
      currentUser: null,
      loading: true,
      error: null
    }
  }

  if (!isSignedIn) {
    return {
      currentUser: null,
      loading: false,
      error: null
    }
  }

  try {
    return {
      currentUser: clientAuth.currentUser,
      loading: false,
      error: null
    }
  } catch (error) {
    return {
      currentUser: null,
      loading: false,
      error: error instanceof Error ? error : new Error('Failed to get user data')
    }
  }
}