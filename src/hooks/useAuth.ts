'use client'

import { useState, useEffect, useCallback } from 'react'
import { clientAuth } from '@/app/lib/firebaseClient'
import { User, onAuthStateChanged } from "firebase/auth"
import { handleAuthError } from '@/auth/errorHandling'


interface AuthState {
  loading: boolean
  isSignedIn: boolean
  userId: string | null
  error: Error | null
}

export function useAuth(): AuthState {
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
        error: error instanceof Error ? error : new Error('An unknown error occurred')
      })
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(clientAuth, updateAuthState, handleError)
        return () => unsubscribe()
    }, [updateAuthState, handleError])

    return authState
}