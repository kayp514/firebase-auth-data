"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MailCheck, CheckCircle2, ChevronLeft, RefreshCw, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AuthBackground } from "./background"
import { cn } from "@/lib/utils"
import { useSignUp } from '../../signup/ctx/signup-ctx'
import { resendEmailVerification } from '@/app/actions/auth'

const RESEND_COOLDOWN = 59 // 59 seconds cooldown for resend
const MAX_RESEND_ATTEMPTS = 4


export function Verify() {
    const router = useRouter()
    const { email } = useSignUp()
  
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const [resendAttempts, setResendAttempts] = useState(0)
  
    // Redirect if no email in context
    useEffect(() => {
      if (!email) {
        router.push("/sign-in")
      }
    }, [email, router])
  
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (resendCooldown > 0) {
          timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1)
          }, 1000)
        }
        return () => clearInterval(timer)
      }, [resendCooldown])
  
    const handleResendVerification = async () => {
      if (!email || isResending || resendCooldown > 0 || resendAttempts >= MAX_RESEND_ATTEMPTS) return
  
      try {
        setIsResending(true)
        setError("")
        setSuccess("")

        const result = await resendEmailVerification()

        if (result.success) {
            if (result.isVerified) {
              // If already verified, show success message and redirect after delay
              setSuccess(result.message)
              setTimeout(() => {
                router.push('/sign-in')
              }, 2000)
            } else {
              // If not verified, increment attempts and start cooldown
              setSuccess(result.message)
              setResendAttempts((prev) => prev + 1)
              setResendCooldown(RESEND_COOLDOWN)
            }
          }

      } catch (error) {
        setError("Failed to resend verification email. Please try again.")
      } finally {
        setIsResending(false)
      }
    }
  
    const handleRedirectToSignIn = () => {
      router.push("/sign-in")
    }
  
    if (!email) {
      return null // Will redirect in useEffect
    }
  
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthBackground />
  
        <Link
          href="/sign-in"
          className={cn(
            "absolute top-8 left-8 flex items-center text-sm font-medium text-muted-foreground",
            "transition-colors hover:text-primary",
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>
  
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-lg" />
                <div className="relative rounded-full bg-primary/10 p-3">
                  <MailCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent a verification link to
              <br />
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
  
          <CardContent className="p-6 space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

{success && (
  <Alert 
    variant="default" 
    className={cn(
      "animate-in fade-in-50",
      success.includes("already verified") ? "bg-green-50" : "bg-blue-50"
    )}
  >
    <AlertDescription 
      className={success.includes("already verified") ? "text-green-800" : "text-blue-800"}
    >
      {success}
    </AlertDescription>
  </Alert>
)}
  
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <MailCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Already verified?</p>
                    <p className="text-sm text-muted-foreground">
                      If you&apos;ve already clicked the verification link in your email, you can proceed to sign in.
                    </p>
                  </div>
                </div>
              </div>
  
              <Button onClick={handleRedirectToSignIn} className="w-full" variant="outline">
                Continue to sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
  
              <Separator />
  
              <div className="space-y-2">
                <div className="space-y-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Didn&apos;t receive the email? Check your spam folder or request a new link
                    {resendCooldown > 0 && ` in ${resendCooldown}s`}
                  </p>
                  {resendAttempts >= MAX_RESEND_ATTEMPTS ? (
                    <Alert>
                      <AlertDescription>
                        Maximum resend attempts reached. Please try signing up again or contact support.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Button
                      onClick={handleResendVerification}
                      className="w-full"
                      disabled={isResending || resendCooldown > 0 || resendAttempts >= MAX_RESEND_ATTEMPTS}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend verification email
                          {resendAttempts > 0 && ` (${MAX_RESEND_ATTEMPTS - resendAttempts} left)`}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }