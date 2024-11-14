//app/apps/[appiD]/callbacks/page.tsx

import CallbacksPage from '@/app/ui/callbacksUI'


export default async function AppCallbacksPage({ params }: { params: Promise<{ appId: string }> }) {
    const resolvedParams = await Promise.any([params])
    const { appId } = resolvedParams

  return (
    <CallbacksPage />
  )
}