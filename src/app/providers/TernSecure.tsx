'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Session } from '../lib/authServer'
import { useRouter, usePathname } from 'next/navigation'
import { refreshServerToken } from '../actions/auth'

interface TernSecureContextType {
    session: Session | null;
    loading: boolean;
    refreshSession: () => Promise<void>;
  }

const TernSecureContext = createContext<TernSecureContextType>({
  session: null,
  loading: false,
  refreshSession: async () => {},
})

export const TernSecure = ({ 
  children, 
  initialSession 
}: { 
  children: React.ReactNode, 
  initialSession: Session | null 
}) => {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const refreshSession = useCallback(async () => {
    if (loading) return 

    setLoading(true)
    try {
        const newSession = await refreshServerToken()
        if (newSession) {
          setSession(newSession)
        } else {
          setSession(null)
          if (!pathname.includes('/login')) {
            router.push('/login')
          }
        }
    } catch (error) {
      console.error('Failed to refresh session:', error)
      setSession(null)
      router.push('/login')
    } finally {
    setLoading(false)
  }
}, [loading, router, pathname])


  return (
    <TernSecureContext.Provider value={{ session, loading, refreshSession }}>
      {children}
    </TernSecureContext.Provider>
  )
}

export const useTernSecure = () => useContext(TernSecureContext)