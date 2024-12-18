'use client'

import { SignIn } from '@/app/ui/sign-in'
import { Suspense } from 'react'

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  )
}