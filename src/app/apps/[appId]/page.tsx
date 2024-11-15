//app/apps/[appiD]/page.tsx

import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/authServer'
import AppIdDashboardContent from '@/app/ui/appIdDashboardContent'
import { getApps } from '@/app/lib/getApps'


export default async function AppIdPage({ params }: { params: Promise<{ appId: string }> }) {
  const appId = (await params).appId

  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  const data = await getApps(session, appId)
  console.log('Data from ID page', data)

  if (!data || !data.app) {
    notFound()
  }


  return <AppIdDashboardContent appConfig={data.app} />
}