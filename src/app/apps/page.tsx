//app/apps/page.tsx

import { Suspense } from 'react'
import OverviewUI from '@/app/ui/overview-ui'
import { getApps } from '@/app/lib/getApps'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {

  async function AppsData() {
    const data = await getApps()
    return <OverviewUI initialApps={data.apps} />
  }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AppsData />
      </Suspense>
    )
  }