'use client'

import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { clientAuth } from '@/app/lib/firebaseClient'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



export default function RegisterAppPage() {
  const [appName, setAppName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const user = clientAuth.currentUser;
        console.log("registerApp - User:", user);
        const token = await user?.getIdToken();
        console.log("registerApp - Token:", token);
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/admin/registerApp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appName: appName.trim() }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.appId) {
        toast({
          title: "App Registered!",
          description: "You can add components to your app using the cli.",
        })
        setAppName('')
      } else {
        throw new Error('Failed to register app: No appId returned')
      }
    } catch (error) {
      console.error('Error registering app:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register app',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Register External App</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="appName" className="block text-sm font-medium text-gray-700">
            App Name
          </label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Registering...' : 'Register App'}
        </button>
      </form>
      <Toaster />
    </div>
  )
}