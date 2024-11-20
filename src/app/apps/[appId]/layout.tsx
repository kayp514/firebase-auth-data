// app/apps/[appId]/layout.tsx

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppDashboardSidebar } from '@/app/ui/sidebar'


export default function AppDashboardLayout({ children }: { children: React.ReactNode }) {
 


  return (
    <SidebarProvider>
    <div className="flex h-screen overflow-hidden">
      <AppDashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
    </SidebarProvider>
  )
}
