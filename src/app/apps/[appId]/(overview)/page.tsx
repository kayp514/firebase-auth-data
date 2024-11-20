//app/apps/[appiD]/page.tsx

import { notFound } from 'next/navigation'
import AppIdDashboardContent from '@/app/ui/appIdDashboardContent'
import { getApps } from '@/app/lib/getApps'


export default async function AppIdPage({ params }: { params: Promise<{ appId: string }> }) {
  const appId = (await params).appId

    const data = await getApps(appId)

    return (
        <AppIdDashboardContent appConfig={data.app} />
    )
}