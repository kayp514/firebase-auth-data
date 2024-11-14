//app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/app/lib/authServer'

export default async function Home() {
 const session = await getServerSession()


 if (session) {
  console.log('Session', session)
  redirect('/apps')
} else {
  console.log('no session back to login')
  redirect('/login')
}

return null
}