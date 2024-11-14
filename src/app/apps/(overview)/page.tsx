//app/apps/(overview)/page.tsx

import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/authServer'
import OverviewUI from '@/app/ui/overview-ui'
import { getApps } from '@/app/lib/getApps';

export default async function OverviewPage() {
  const session = await getServerSession()
  console.log('Session on apps page')

  if (!session) {
    console.log('Session on apps page', session)
    redirect('/login')
  }


  const data = await getApps(session)


  return <OverviewUI initialApps={data.apps} user={session.user} />
}