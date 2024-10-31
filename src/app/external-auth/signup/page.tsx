import { Suspense } from 'react'
import ExternalSignupForm from './signupForm'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ExternalSignupForm />
    </Suspense>
  )
}