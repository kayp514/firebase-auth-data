'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { clientAuth } from '@/app/lib/firebaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from "@/components/ui/toaster"

interface Callback {
    id: string
    callbackUrl: string
    isWildcard: boolean
  }

export default function CallbacksPage() {
    const [callbacks, setCallbacks] = useState<Callback[]>([])
    const [newCallback, setNewCallback] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { appId } = useParams()
    const { toast } = useToast()

  useEffect(() => {
    fetchCallbacks()
  }, [appId])

  const fetchCallbacks = async () => {
    setIsLoading(true)
    try {
      const user = clientAuth.currentUser
      if (!user) throw new Error('User not authenticated')

      const token = await user.getIdToken()
      const response = await fetch(`/api/admin/manageCallbacks?appId=${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch callbacks')

      const data = await response.json()
      setCallbacks(data.callbacks)
    } catch (error) {
      console.error('Error fetching callbacks:', error)
      toast({
        title: 'Error',
        description: 'Failed to load callbacks',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addCallback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCallback.trim()) return

    setIsLoading(true)
    try {
      const user = clientAuth.currentUser
      if (!user) throw new Error('User not authenticated')

      const token = await user.getIdToken()
      const response = await fetch('/api/admin/manageCallbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appId, callbackUrl: newCallback })
      })

      if (!response.ok) throw new Error('Failed to add callback')

      await fetchCallbacks() // Refresh the list after adding
      setNewCallback('')
      toast({
        title: 'Success',
        description: 'Callback added successfully',
      })
    } catch (error) {
      console.error('Error adding callback:', error)
      toast({
        title: 'Error',
        description: 'Failed to add callback',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCallback = async (callbackUrl: string) => {
    setIsLoading(true)
    try {
      const user = clientAuth.currentUser
      if (!user) throw new Error('User not authenticated')

      const token = await user.getIdToken()
      const response = await fetch('/api/admin/manageCallbacks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appId, callbackUrl })
      })

      if (!response.ok) throw new Error('Failed to delete callback')

      await fetchCallbacks() // Refresh the list after deleting
      toast({
        title: 'Success',
        description: 'Callback deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting callback:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete callback',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Callbacks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addCallback} className="flex gap-2 mb-4">
          <Input
            type="url"
            placeholder="Enter callback URL"
            value={newCallback}
            onChange={(e) => setNewCallback(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" className=" text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"  disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : callbacks.length === 0 ? (
          <div className="text-center text-muted-foreground">No callbacks added yet.</div>
        ) : (
          <ul className="space-y-2">
            {callbacks.map((callback) => (
              <li key={callback.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="truncate mr-2">
                  {callback.callbackUrl}
                  {callback.isWildcard && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Wildcard</span>}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCallback(callback.callbackUrl)}
                  aria-label={`Delete callback ${callback.callbackUrl}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <Toaster />
    </Card>
  )
}