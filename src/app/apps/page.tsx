//app/apps/page.tsx

import { Suspense } from 'react'
import OverviewUI from '@/app/ui/overview-ui'
import { getApps } from '@/app/lib/getApps'

export default async function OverviewPage() {

  async function AppsData() {
    const data = await getApps()
    return <OverviewUI initialApps={data.apps} />
  }

    return (
      <Suspense>
        <AppsData />
      </Suspense>
    )
  }