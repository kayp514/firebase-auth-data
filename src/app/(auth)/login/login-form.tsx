'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/app/lib/auth'
import { useTheme } from 'next-themes'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { theme } = useTheme()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 ${theme === 'dark' ? 'bg-white/5 text-white ring-white/10 focus:ring-indigo-500' : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset   focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 ${theme === 'dark' ? 'bg-white/5 ring-white/10 focus:ring-indigo-500' : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'}`}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>
      <p className={`mt-10 text-center text-sm  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            don't have an account?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
              Create an account
            </a>
          </p>
    </div>
  )
}