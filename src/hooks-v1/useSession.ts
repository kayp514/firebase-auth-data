'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'
import { clientAuth } from '@/app/lib/firebaseClient'
import { User } from 'firebase/auth'

interface SessionData {
  accessToken: string | null
  expirationTime: number | null
  error: Error | null
  isLoading: boolean
}

type SessionStatus = 'active' | 'expired' | 'refreshing' | 'inactive'

export function useSession() {
  const { isSignedIn, loading: authLoading } = useAuth()
  const [sessionData, setSessionData] = useState<SessionData>({
    accessToken: null,
    expirationTime: null,
    error: null,
    isLoading: true
  })

  const status = useMemo((): SessionStatus => {
    if (sessionData.isLoading) return 'refreshing'
    if (!isSignedIn || !sessionData.accessToken) return 'inactive'
    if (sessionData.error) return 'expired'
    if (sessionData.expirationTime && sessionData.expirationTime < Date.now()) return 'expired'
    return 'active'
  }, [isSignedIn, sessionData])

  const refreshSession = useCallback(async () => {
    if (!isSignedIn) {
      setSessionData({
        accessToken: null,
        expirationTime: null,
        error: null,
        isLoading: false
      })
      return
    }

    try {
      const user = clientAuth.currentUser as User
      if (!user) throw new Error('No authenticated user')

      const idTokenResult = await user.getIdTokenResult(true)
      setSessionData({
        accessToken: idTokenResult.token,
        expirationTime: new Date(idTokenResult.expirationTime).getTime(),
        error: null,
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to refresh session:', error)
      setSessionData(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
        isLoading: false
      }))
    }
  }, [isSignedIn])

  useEffect(() => {
    if (!authLoading) {
      refreshSession()
    }
  }, [authLoading, refreshSession])

  return {
    accessToken: sessionData.accessToken,
    expirationTime: sessionData.expirationTime,
    error: sessionData.error,
    isLoading: sessionData.isLoading || authLoading,
    status,
    refreshSession
  }
}