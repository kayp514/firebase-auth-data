'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { handleAuthRedirectResult } from '../../actions/auth'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleRedirect() {
      try {
        const result = await handleAuthRedirectResult()
        if (result.success) {
          router.push('/')
        } else {
          console.error('Auth error:', result.error)
          const errorMessage = encodeURIComponent(result.error)
          router.push(`/login?error=${errorMessage}`)
        }
      } catch (err) {
        console.error('Callback error:', err)
        setError('Authentication failed. Please try again.')
        setTimeout(() => {
          router.push('/login?error=Authentication failed')
        }, 2000)
      }
    }

    handleRedirect()
  }, [router])

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  )
}

