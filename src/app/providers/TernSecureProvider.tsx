'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { useAuth as useAuthHook } from '@/hooks/useAuth'
import { useSession as useSessionHook } from '@/hooks/useSession'
import { useCurrentUser as useCurrentUserHook } from '@/hooks/useCurrentUser'
import { useIdToken as useIdTokenHook } from '@/hooks/useIdToken'

interface TernSecureContextType {
  isSignedIn: boolean
  loading: boolean
  userId: string | null
  error: Error | null
}

const TernSecureContext = createContext<TernSecureContextType | undefined>(undefined)

export function TernSecureProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuth()

  const contextValue = useMemo(() => ({
    isSignedIn: authState.isSignedIn,
    loading: authState.loading,
    userId: authState.userId,
    error: authState.error
  }), [authState.isSignedIn, authState.loading, authState.userId])

  if (contextValue.error) {
    return <div>Error in TernSecureProvider: {contextValue.error.message}</div>
  }

  return (
    <TernSecureContext.Provider value={contextValue}>
      {children}
    </TernSecureContext.Provider>
  )
}

function useTernSecure(hookName: string) {
  const context = useContext(TernSecureContext)
  if (context === undefined) {
    throw new Error(`${hookName} must be used within a TernSecureProvider`)
  }
  return context
}

export function useAuth() {
  useTernSecure('useAuth')
  return useAuthHook()
}

export function useSession() {
  useTernSecure('useSession')
  return useSessionHook()
}

export function useCurrentUser() {
  useTernSecure('useCurrentUser')
  return useCurrentUserHook()
}

export function useIdToken() {
  useTernSecure('useIdToken')
  return useIdTokenHook()
}