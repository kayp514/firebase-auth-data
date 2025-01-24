import { SignupProvider } from "./ctx/SignUpProvider"

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SignupProvider>
      <div className="min-h-screen">{children}</div>
    </SignupProvider>
  )
}

