//app/dashbaord/ui/registerApp.tsx

'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { clientAuth } from '@/app/lib/firebaseClient'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface RegisteredApp {
  id: string;
  appId: string;
  appName: string;
  clientSecretHash: string;
  createdAt: string;
}

export default function RegisterAppPage() {
  const [appName, setAppName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registeredApps, setRegisteredApps] = useState<RegisteredApp[]>([])
  const [visibleSecrets, setVisibleSecrets] = useState<{[key: string]: string}>({})
  const { toast } = useToast()

  const fetchRegisteredApps = async () => {
    try {
      const user = clientAuth.currentUser;
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/admin/getRegisteredApps', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRegisteredApps(data.apps);
    } catch (error) {
      console.error('Error fetching registered apps:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch registered apps',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchRegisteredApps();
  }, [fetchRegisteredApps]);

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

      console.log("registerApp - appName:", appName);

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
        fetchRegisteredApps(); // Refresh the list of registered apps
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

  const toggleSecretVisibility = async (appId: string) => {
    if (visibleSecrets[appId]) {
      setVisibleSecrets(prev => ({...prev, [appId]: ''}))
    } else {
      try {
        const user = clientAuth.currentUser;
        const token = await user?.getIdToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/admin/getClientSecret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ appId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVisibleSecrets(prev => ({...prev, [appId]: data.clientSecret}))
      } catch (error) {
        console.error('Error fetching client secret:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch client secret',
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 h-screen">
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Register External App</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
      <div className="w-full md:w-1/2">
      <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Registered Apps</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
          <CardContent>
            {registeredApps.length === 0 ? (
              <p className="text-gray-500">No apps registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {registeredApps.map((app, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2">
                    <strong className="text-indigo-600">{app.appName}</strong>
                    <br />
                    <span className="text-sm text-gray-500">ID: {app.appId}</span>
                    <br />
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          Secret Key: {visibleSecrets[app.id] ? visibleSecrets[app.id] : '••••••••'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSecretVisibility(app.id)}
                          aria-label={visibleSecrets[app.id] ? "Hide secret key" : "Show secret key"}
                        >
                          {visibleSecrets[app.id] ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    <span className="text-sm text-muted-foreground">Created: {new Date(app.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          </ScrollArea>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}