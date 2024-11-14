//app/(auth)/login/page.tsx
import { Suspense } from 'react'
import LoginForm from './loginForm'

export default async function LoginPage() {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    )
}