//app/ui/overview-ui.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {  Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { useTheme } from 'next-themes'
import AppRegisterDialog from '@/app/ui/registerAppDialog'

interface App {
  id: string
  defaultDomain: string
  appName: string
  appId: string
  createdAt: string
}

interface User {
    uid: string
    email: string
}

interface OverviewProps {
    initialApps: App[]
    user: User
  }

export default function OverviewUI({ initialApps, user }: OverviewProps) {
  const [apps, setApps] = useState<App[]>(initialApps)
  const { theme } = useTheme()
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)


  const handleRegisterApp = () => {
    setShowRegisterDialog(true)
  }

  const handleAppRegistered = (newApp: App) => {
    setApps(prevApps => [...prevApps, newApp])
    setShowRegisterDialog(false)
  }

  return (
    <div className="p-6">
      <AppRegisterDialog 
        isOpen={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        onAppRegistered={handleAppRegistered}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <Button
        onClick={handleRegisterApp} 
        size="sm" 
        className="border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus className="mr-2 h-5 w-5" /> Register New App
        </Button>
      </div>
      
      {apps.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-muted-foreground mb-4">You haven't registered any apps yet.</p>
              <Button asChild>
                <Link href="/apps/register">Register Your First App</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.appName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Domain: {app.defaultDomain}</p>
                  <p><strong>Created At:</strong> {new Date(app.createdAt).toLocaleString()}</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button asChild className='text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    <Link href={`/apps/${app.id}`}>Configure</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  )
}