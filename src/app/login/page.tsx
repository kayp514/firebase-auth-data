//app/login/page.tsx
import { SignIn } from './sign-in'

export default function LoginPage() {

    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full">
            <SignIn/>
        </div>
      </div>
    )
}