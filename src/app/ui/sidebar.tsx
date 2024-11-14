//app/ui/siderbar.tsx

'use client'
import { useState, useEffect } from 'react'
import { usePathname, useParams  } from 'next/navigation'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Home, Users, Bell, Settings } from 'lucide-react'
import Toggle from './toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { clientAuth } from '@/app/lib/firebaseClient'

const navigation = [
  { name: 'Dashboard', icon: Home, href: '' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Callbacks', icon: Bell, href: '/callbacks' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

interface App {
  id: string
  appName: string
  appId: string
  createdAt: string
}

export function AppDashboardSidebar() {
  const params = useParams()
  const [currentAppId, setCurrentAppId] = useState(params.appId as string)
  const [apps, setApps] = useState<App[]>([])
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const user = clientAuth.currentUser
        if (!user) return

        const token = await user.getIdToken()
        const response = await fetch('/api/admin/getRegisteredApps', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch apps')
        }

        const data = await response.json()
        setApps(data.apps)
      } catch (error) {
        console.error('Error fetching apps:', error)
      }
    }

    fetchApps()
  }, [])

    const handleAppChange = (appId: string) => {
      setCurrentAppId(appId)
      window.location.href = `/apps/${appId}`
    }

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 ">
       <Select value={currentAppId} onValueChange={handleAppChange}>
          <SelectTrigger className="w-full">
           <SelectValue placeholder="Select an app">
              {apps.find(app => app.id === currentAppId)?.appName || 'Select an app'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className=''>
            {apps.map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.appName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
            <Link href={`/apps/${currentAppId}${item.href}`} passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === `/apps/${currentAppId}${item.href}`}
                className={`flex items-center gap-2 ${
                  pathname === `/apps/${currentAppId}${item.href}`
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-gray-600 hover:text-accent-foreground'
                }`}
              >
                <div>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
        <Toggle /> <span>Dark Mode</span> 
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}