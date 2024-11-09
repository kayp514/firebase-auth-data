// app/external-auth/login/page.tsx

import { Suspense } from 'react'
import ExternalLoginForm from './login-form';

export default async function LoginPage({
  searchParams,
}: {
    searchParams: Promise<{ callback?: string; redirect?: string; appId?: string; clientSecret?: string; }>
}) {

  const { callback, redirect, appId, clientSecret } = await searchParams
  const callbackUrl = callback || ''
  const redirectUrl = redirect  || ''
  const appIdParam = appId || ''
  const clientSecretParam = clientSecret || ''

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <ExternalLoginForm 
        callbackUrl={callbackUrl} 
        redirectUrl={redirectUrl} 
        appId={appIdParam} 
        clientSecret={clientSecretParam} 
        />
      </Suspense>
    </div>
  )
}