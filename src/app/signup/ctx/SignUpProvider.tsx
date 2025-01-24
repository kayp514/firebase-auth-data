"use client"

import { useState, ReactNode } from "react"
import { SignUpCtx } from './signup-ctx'


export function SignupProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("")

  return (
  <SignUpCtx.Provider value={{ email, setEmail }}>
    {children}
  </SignUpCtx.Provider>

)
}


