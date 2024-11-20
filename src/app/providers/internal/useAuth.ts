'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, onAuthStateChanged } from "firebase/auth"
import { clientAuth } from '@/app/lib/firebaseClient'
import { handleAuthError } from '@/auth/errorHandling'
import { useInternalContext } from '../TernSecureProvider'

interface AuthState {
    loading: boolean
    isSignedIn: boolean
    userId: string | null
    error: Error | null
  }

function useAuthInternal() {
    const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    isSignedIn: false,
    userId: null,
    error: null
  })

  const updateAuthState = useCallback((user: User | null) => {
    setAuthState({
      loading: false,
      isSignedIn: !!user,
      userId: user?.uid || null,
      error: null
    })
  }, [])

  const handleError = useCallback((error: Error) => {
    handleAuthError(error)
    setAuthState({
      loading: false,
      isSignedIn: false,
      userId: null,
      error
    })
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, updateAuthState, handleError)
    return () => unsubscribe()
  }, [updateAuthState, handleError])

  useInternalContext('useAuth')

  return { authState }
}

export const useAuth = useAuthInternal