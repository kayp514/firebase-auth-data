"use client"

import { createContext, useContext } from "react"

interface SignupCtxType {
  email: string
  setEmail: (email: string) => void
}

export const SignUpCtx = createContext<SignupCtxType | undefined>(undefined)

SignUpCtx.displayName = 'SignupCtx'


export function useSignUp() {
  const context = useContext(SignUpCtx)
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider")
  }
  return context
}

