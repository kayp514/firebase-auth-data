'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from "@/components/ui/toaster"
import { Icons } from '@/app/ui/icons'
import { useRouter } from 'next/navigation'

export default function ExternalSignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [userUuid, setUserUuid] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userCreated, setUserCreated] = useState('')
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const appId = searchParams?.get('appId')
    const redirectUrl = searchParams?.get('redirectUrl')
    if (!appId || !redirectUrl) {
      router.push('/')
    } else {
      setIsValid(true)
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const appId = searchParams?.get('appId')
      const redirectUrl = searchParams?.get('redirectUrl')

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, appId, redirectUrl }),
      })

      const data = await response.json()

      if (response.ok) {
        setSignupSuccess(true)
        setUserUuid(data.userUuid)
        setUserRole(data.role)
        setUserCreated(data.created)

        toast({
          title: 'Success',
          description: 'Signup successful. Redirecting...',
          variant: 'default',
        })

        // Send message to opener window
        if (window.opener) {
          window.opener.postMessage({
            type: 'SIGNUP_SUCCESS',
            data: {
              status: 'success',
              email: email,
              userUuid: data.userUuid,
              role: data.role,
              created: data.createdAt
            }
          }, '*') // Replace '*' with the external app's origin for added security
        }
        // Delay redirect to show success message
       // setTimeout(() => {
         // window.close()
       // }, 3000)
      } else {
        throw new Error(data.error || 'Failed to sign up')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign up',
        variant: 'destructive',
      })
      if (window.opener) {
        window.opener.postMessage({
          type: 'SIGNUP_ERROR',
          error: error instanceof Error ? error.message : 'Failed to sign up'
        }, '*') // Replace '*' with the external app's origin for added security
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValid) {
    return null
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {signupSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Signup Successful!</h2>
            <p className="mb-2">Your UUID: {userUuid}</p>
            <p className="mb-4">Your Role: {userRole}</p>
            <p className="mb-4">Created : {userCreated}</p>
            <p>Redirecting to the app...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
      <Toaster />
    </div>
  )
}