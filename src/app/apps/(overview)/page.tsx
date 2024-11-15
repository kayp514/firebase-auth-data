//app/apps/(overview)/page.tsx

import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/authServer'
import OverviewUI from '@/app/ui/overview-ui'
import { getApps } from '@/app/lib/getApps';

export default async function OverviewPage() {
  const session = await getServerSession()
  console.log('Session on apps page', session)


  const data = await getApps(session)
  console.log('Data from overview page', data)


  return <OverviewUI initialApps={data.apps} user={session!.user} />
}