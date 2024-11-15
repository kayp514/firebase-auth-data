//app/(auth)/login/page.tsx
import LoginForm from './loginForm'

export default async function LoginPage() {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full">
            <LoginForm />
        </div>
      </div>
    )
}