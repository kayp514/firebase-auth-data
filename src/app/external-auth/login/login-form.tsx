// app/external-auth/login/login-form.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams  } from 'next/navigation'
import { signIn } from '@/app/lib/auth'
import { useTheme } from 'next-themes'
import { useToast } from '@/hooks/use-toast'
import { FirebaseError } from 'firebase/app'
import { Toaster } from '@/components/ui/toaster'
import { Icons } from '../../ui/icons'
import { app } from 'firebase-admin'

interface ExternalLoginFormProps {
  callbackUrl: string;
  redirectUrl: string;
  appId: string;
  clientSecret: string;
}

export default function ExternalLoginForm({ callbackUrl, redirectUrl, appId, clientSecret }: ExternalLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme } = useTheme()
  const { toast } = useToast()



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('https://api.ternsecure.com/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'TernSecure-Server/1.0' 
        },
        body: JSON.stringify({ email, password, callbackUrl, redirectUrl, appId, clientSecret }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(data.redirectUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Login failed. Please try again.')
        console.log(errorData)
        toast({
          title: 'Error',
          description: errorData.error || 'Login failed. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.log(error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
        })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            alt=""
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className={`mt-6 text-center text-2xl font-bold leading-9 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="px-6 py-12 shadow sm:rounded-lg sm:px-12 ">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset  focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 ${theme === 'dark' ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500 ' : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 '}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium leading-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset  focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 ${theme === 'dark' ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500 ' : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 '}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isLoading && <Icons.spinner className="animate-spin" />}
                  Sign in
                </button>
              </div>
            </form>
           
            <div>
              <div className="relative mt-10">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
              </div>
              
            </div>
          </div>
        </div>
        <Toaster />
      </div>
  )
}