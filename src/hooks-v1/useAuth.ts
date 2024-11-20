'use client'

import { useState, useEffect } from 'react'
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(clientAuth, (user: User | null) => {
            if (user) {
                setAuthState({
                    loading: false,
                    isSignedIn: true,
                    userId: user.uid,
                    error: null
                })
            } else {
                setAuthState({
                    loading: false,
                    isSignedIn: false,
                    userId: null,
                    error: null
                })
            }
        }, (error) => {
            handleAuthError(error)
            setAuthState({
                loading: false,
                isSignedIn: false,
                userId: null,
                error: error instanceof Error ? error : new Error('An unknown error occurred')
            })
        })
  
        return () => unsubscribe()
    }, [])

    return authState
}