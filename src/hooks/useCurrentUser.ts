'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from "firebase/auth"
import { clientAuth } from "@/app/lib/firebaseClient"
import { useAuth } from './useAuth'

interface CurrentUserState {
  currentUser: User | null
  loading: boolean
  error: Error | null
}

export function useCurrentUser(): CurrentUserState & { getUserData: () => Promise<User | null> } {
  const { isSignedIn, loading: authLoading } = useAuth()
  const [state, setState] = useState<CurrentUserState>({
    currentUser: null,
    loading: true,
    error: null
  })

  const getUserData = useCallback(async () => {
    if (!isSignedIn) return null

    try {
      await clientAuth.authStateReady()
      return clientAuth.currentUser
    } catch (error) {
      console.error('Error getting user data:', error)
      throw error instanceof Error ? error : new Error('Failed to get user data')
    }
  }, [isSignedIn])

  useEffect(() => {
    if (authLoading) return

    if (!isSignedIn) {
      setState({
        currentUser: null,
        loading: false,
        error: null
      })
      return
    }

    getUserData()
      .then(user => {
        setState({
          currentUser: user,
          loading: false,
          error: null
        })
      })
      .catch(error => {
        setState({
          currentUser: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to get user data')
        })
      })
  }, [isSignedIn, authLoading, getUserData])

  return { ...state, getUserData }
}