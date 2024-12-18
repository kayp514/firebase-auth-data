'use client'

import { SignIn } from '../providers/components/sign-in'
import { Suspense } from 'react'

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  )
}