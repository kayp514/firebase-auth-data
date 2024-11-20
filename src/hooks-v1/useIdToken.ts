// app/hooks/useIdToken.ts

'use client'

import { useAuth } from './useAuth'
import { useState, useCallback, useEffect } from 'react'
import { clientAuth } from '@/app/lib/firebaseClient'
import { User } from 'firebase/auth'

interface IdTokenResult {
  token: string | null
  claims: { [key: string]: any } | null
  issuedAtTime: string | null
  expirationTime: string | null
  authTime: string | null
  signInProvider: string | null
}

interface IdTokenState {
  tokenResult: IdTokenResult | null
  loading: boolean
  error: Error | null
  refreshToken: () => Promise<void>
}

export function useIdToken(): IdTokenState {
  const { isSignedIn, loading: authLoading } = useAuth()
  const [tokenState, setTokenState] = useState<IdTokenState>({
    tokenResult: null,
    loading: true,
    error: null,
    refreshToken: async () => {}
  })

  const getFormattedTokenResult = async (user: User) => {
    const result = await user.getIdTokenResult()
    return {
      token: result.token,
      claims: result.claims,
      issuedAtTime: result.issuedAtTime,
      expirationTime: result.expirationTime,
      authTime: result.authTime,
      signInProvider: result.signInProvider
    }
  }

  const refreshToken = useCallback(async () => {
    if (!isSignedIn || !clientAuth.currentUser) {
      setTokenState(prev => ({
        ...prev,
        tokenResult: null,
        loading: false,
        error: null
      }))
      return
    }

    try {
      const tokenResult = await getFormattedTokenResult(clientAuth.currentUser)
      setTokenState(prev => ({
        ...prev,
        tokenResult,
        loading: false,
        error: null
      }))
    } catch (error) {
      setTokenState(prev => ({
        ...prev,
        tokenResult: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to get token')
      }))
    }
  }, [isSignedIn])

  useEffect(() => {
    if (!authLoading) {
      refreshToken()
    }
  }, [authLoading, refreshToken])

  return tokenState
}