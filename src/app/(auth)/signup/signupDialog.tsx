import { useState } from "react"
import {
    Dialog,
    DialogContent, 
    DialogDescription, 
    DialogTrigger, 
    DialogTitle, 
    DialogHeader } from "@/components/ui/dialog"
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline"
import SignupForm from "./signupForm"
import { Toaster } from "@/components/ui/toaster"

export default function SignupDialog(){
    const [isOpen, setIsOpen] = useState(false)

    const handleSignUpSuccess = () => {
        
        setTimeout(() => setIsOpen(false), 2000)
      }
    return (

<div className="mt-6 grid grid-cols-2 gap-4">
<Dialog open={isOpen} onOpenChange={setIsOpen}>
 <DialogTrigger
  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
>
  <EnvelopeIcon className="h-5 w-5" />
  <span className="text-sm font-semibold leading-6">Email</span>
 </DialogTrigger>
 <DialogContent>
  <DialogHeader>
    <DialogTitle>Create Account</DialogTitle>
    <DialogDescription>
      Enter your email and password to create account 
      <div><SignupForm onSuccess={handleSignUpSuccess} /></div>
    </DialogDescription>
  </DialogHeader>
 </DialogContent>
</Dialog>

<Dialog>
  <DialogTrigger
className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
>
  <UserIcon className="h-5 w-5" />
  <span className="text-sm font-semibold leading-6">Anonymously</span>
</DialogTrigger>
<DialogContent>
  <DialogHeader>
    <DialogTitle>Sign in Anonymously</DialogTitle>
    <DialogDescription>
      Sign in to your account anonymously
    </DialogDescription>
  </DialogHeader>
</DialogContent>
</Dialog>
<Toaster />
</div>

    )}