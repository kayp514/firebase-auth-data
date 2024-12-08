'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth"
import { clientAuth } from '@/app/lib/firebaseClient'
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(clientAuth, (user) => {
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
    })
    
    return () => unsubscribe()
  }, [])

  useInternalContext('useAuth')
  return { authState }
}

export const useAuth = useAuthInternal