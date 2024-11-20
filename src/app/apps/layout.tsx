//app/apps/layout.tsx
'use client'

import { redirect, useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut } from 'lucide-react'
import { clientAuth } from '@/app/lib/firebaseClient'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useAuth } from '../providers/TernSecureProvider'
import { useCurrentUser } from '../providers/TernSecureProvider'



export default function AppsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { theme } = useTheme()
  const { authState } = useAuth()
  const { isSignedIn, loading, userId} = authState
  const { currentUser, loading: userLoading } = useCurrentUser()
  const user = currentUser || {email: null}


  const handleSignOut = async () => {
    try {
      await clientAuth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if(!isSignedIn) {
    redirect('/login')
  }



  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 flex items-center justify-between px-6">
          <div className="flex-1">
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative hover:text-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              <Bell className="h-5 w-5 cursor-pointer" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 rounded-full flex items-center gap-2 hover:text-gray-900 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback>{user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.email || 'Loading...'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}