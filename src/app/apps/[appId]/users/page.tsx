//app/apps/[appiD]/users/page.tsx

import ListUsers from '@/app/ui/list-users'


export default async function AppUsersPage({ params }: { params: Promise<{ appId: string }> }) {

  return (
    <ListUsers />
  )
}