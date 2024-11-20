'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from './useAuth'
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
}

export function useIdToken() {
  const { isSignedIn, loading: authLoading } = useAuth()
  const [tokenState, setTokenState] = useState<IdTokenState>({
    tokenResult: null,
    loading: true,
    error: null
  })

  const getFormattedTokenResult = useCallback(async (user: User): Promise<IdTokenResult> => {
    const result = await user.getIdTokenResult(true)
    return {
      token: result.token,
      claims: result.claims,
      issuedAtTime: result.issuedAtTime,
      expirationTime: result.expirationTime,
      authTime: result.authTime,
      signInProvider: result.signInProvider
    }
  }, [])

  const refreshToken = useCallback(async () => {
    if (!isSignedIn || !clientAuth.currentUser) {
      setTokenState({
        tokenResult: null,
        loading: false,
        error: null
      })
      return
    }

    try {
      setTokenState(prev => ({ ...prev, loading: true }))
      const tokenResult = await getFormattedTokenResult(clientAuth.currentUser)
      setTokenState({
        tokenResult,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Failed to refresh token:', error)
      setTokenState({
        tokenResult: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to get token')
      })
    }
  }, [isSignedIn, getFormattedTokenResult])

  useEffect(() => {
    if (!authLoading) {
      refreshToken()
    }
  }, [authLoading, refreshToken])

  return {
    ...tokenState,
    refreshToken
  }
}