"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, MailCheck, CheckCircle2, ChevronLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AuthBackground } from "./background"
import { cn } from "@/lib/utils"
import { clientAuth } from '@/app/lib/firebaseClient'
import { useSignUp } from '../../signup/ctx/signup-ctx'

const VERIFICATION_CHECK_INTERVAL = 3000 // Check every 3 seconds
const VERIFICATION_TIMEOUT = 30000 // 30 seconds timeout

const checkEmailVerification = async (email: string) => {

    try {
        const user = clientAuth.currentUser
        if(!user) {
            throw new Error('Please sign in to check verification status')
        }

        await user.reload()

        if(user.emailVerified) {
            return true
      }
    } catch (error) {
      console.error("Error checking verification:", error)
    }
  }

export function Verify() {
  const router = useRouter()
  const { email } = useSignUp()
  const [isChecking, setIsChecking] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    if (!email) {
      router.push("/sign-in")
    }
  }, [email, router])


  useEffect(() => {
    if (!email) return

    let checkInterval: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    const startVerificationCheck = async () => {
      setIsChecking(true)
      setError("")
      setProgress(0)
      setTimeRemaining(30)
      setCheckCount(0)

      // Start progress bar
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100
          return prev + 100 / (VERIFICATION_TIMEOUT / 1000)
        })
        setTimeRemaining((prev) => {
          if (prev <= 0) return 0
          return prev - 1
        })
      }, 1000)

      // Check verification status periodically
      checkInterval = setInterval(async () => {
        try {
          setCheckCount((prev) => prev + 1)
          const verified = await checkEmailVerification(email)
          if (verified) {
            setIsVerified(true)
            clearInterval(checkInterval)
            clearInterval(progressInterval)
            // Redirect after showing success message
            setTimeout(() => {
              router.push("/sign-in")
            }, 2000)
          }
        } catch (error) {
          console.error("Error checking verification:", error)
        }
      }, VERIFICATION_CHECK_INTERVAL)

      // Set timeout to stop checking after timeout period
      timeoutId = setTimeout(() => {
        clearInterval(checkInterval)
        clearInterval(progressInterval)
        setIsChecking(false)
        if (!isVerified) {
          setError("Verification link has expired. Please request a new one.")
        }
      }, VERIFICATION_TIMEOUT)
    }

    startVerificationCheck()

    return () => {
      clearInterval(checkInterval)
      clearTimeout(timeoutId)
      clearInterval(progressInterval)
    }
  }, [email, router])


  const handleResendVerification = async () => {
    if (!email) return

    try {
      setError("")
      //todo:
    } catch (error) {
      console.error("Error resending verification:", error)
      setError("Failed to resend verification email. Please try again.")
    }
  }


  if (!email) {
    return null 
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
        Back to login
      </Link>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-lg" />
              <div className="relative rounded-full bg-primary/10 p-3">
                {isVerified ? (
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                ) : (
                  <MailCheck className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {isVerified ? "Email Verified!" : "Verify your email"}
          </CardTitle>
          <CardDescription className="text-center">
            {isVerified ? (
              "Your email has been successfully verified. Redirecting to sign in..."
            ) : (
              <>
                We&apos;ve sent a verification link to
                <br />
                <span className="font-medium">{email}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isChecking && !isVerified && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Checking verification status...</span>
                  <span className="font-medium">{timeRemaining}s</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Attempt {checkCount}</span>
              </div>
            </div>
          )}

          {!isChecking && !isVerified && (
            <>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <MailCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Verification link expired</p>
                    <p className="text-sm text-muted-foreground">
                      The verification link has expired. Click below to receive a new verification email.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col space-y-2">
                <Button onClick={handleResendVerification} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend verification email
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/support">Contact Support</Link>
                </Button>
              </div>
            </>
          )}

          {isVerified && (
            <div className="w-full">
              <Progress value={100} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
