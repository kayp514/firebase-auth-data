//app/apps/[appiD]/users/page.tsx

import ListUsers from '@/app/ui/list-users'
import { getUsers } from '@/app/lib/getUsers'


export default async function AppUsersPage({ params }: { params: Promise<{ appId: string }> }) {

  const appId = (await params).appId

  const data = await getUsers(appId)

  return (
    <ListUsers appConfig={data.registeredUsers} />
  )
}