//app/ui/registerAppDialog.tsx

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { clientAuth } from '@/app/lib/firebaseClient'
import { useToast } from '@/hooks/use-toast'

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_APP_URL || 'https://ternsecure.com';

interface App {
    id: string
    defaultDomain: string
    appName: string
    appId: string
    createdAt: string
  }

interface RegisterDialogProps {
    isOpen: boolean
    onClose: () => void
    onAppRegistered: (newApp: App) => void
  }

  export default function AppRegisterDialog({ isOpen, onClose, onAppRegistered }: RegisterDialogProps) {
  const [appName, setAppName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
        const user = clientAuth.currentUser;
        //console.log("registerApp - User:", user);
        const token = await user?.getIdToken();
        //console.log("registerApp - Token:", token);
      if (!token) {
        throw new Error('Not authenticated')
      }

      console.log("registerApp - appName:", appName);

      const response = await fetch(`${AUTH_APP_URL}/api/admin/registerApp`, {
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
          description: "Success.",
        })
        onAppRegistered(data.app)
        setAppName('')
        onClose()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New App</DialogTitle>
          <DialogDescription>
            Enter the name for your new application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appName" className="text-right">
                App Name
              </Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className=" border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ">
              {isLoading ? 'Registering...' : 'Register App'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}