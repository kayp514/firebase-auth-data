'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Github } from 'lucide-react'
import { InstallationGuide } from '@/components/ui/installationguide'
import { useSession } from '../app/providers/TernSecureProvider'

export default function Home() {
  const { status } = useSession()
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <ShieldIcon className="h-6 w-6 mr-2" />
          <span className="font-bold">TernSecure</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#installation">
            Installation
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="https://github.com/TernSecure/nextjs">
            GitHub
          </Link>
        </nav>
        {status === 'active' ? (
  <Button asChild variant="outline" className="bg-white hover:bg-slate-100 text-slate-500 border-slate-400">
    <Link href="/apps">Dashboard</Link>
  </Button>
) : (
  <Button asChild variant="outline" className="bg-white hover:bg-slate-100 text-slate-500 border-slate-400">
    <Link href="/sign-in">Login</Link>
  </Button>
)}
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Authentication for Next.js
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  TernSecure simplifies Firebase Authentication integration in your Next.js projects. Built for Next.js 13, 14, and 15.0.3, with full support for the App Router.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild className="bg-slate-400 hover:bg-slate-500 text-white">
                  <Link href="#installation">Get Started</Link>
                </Button>
                <Button variant="outline" asChild className="bg-white hover:bg-slate-100 text-slate-500 border-slate-400">
                  <Link href="https://github.com/TernSecure/nextjs">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <FeatureCard
                title="Easy Integration"
                description="Seamlessly integrate Firebase Authentication into your Next.js projects with minimal setup."
              />
              <FeatureCard
                title="Server & Client Support"
                description="Manage authentication on both server-side and client-side with ease."
              />
              <FeatureCard
                title="Custom Claims"
                description="Effortlessly handle and verify custom claims for advanced authorization."
              />
              <FeatureCard
                title="Token Management"
                description="Simplified ID token handling and automatic refresh mechanisms."
              />
              <FeatureCard
                title="TypeScript Ready"
                description="Full TypeScript support for a type-safe development experience."
              />
              <FeatureCard
                title="Next.js 13+ Compatible"
                description="Designed to work seamlessly with Next.js versions 13, 14, and 15.0.3, including full App Router support."
              />
            </div>
          </div>
        </section>
        <InstallationGuide />
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Secure Your Next.js App?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get started with TernSecure today and simplify your authentication process.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild className="bg-slate-400 hover:bg-slate-500 text-white">
                  <Link href="https://github.com/TernSecure/nextjs">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ShieldIcon className="h-6 w-6 mr-2 text-slate-400" />
              <span className="font-bold text-gray-900 dark:text-gray-100">TernSecure</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">© 2024 TernSecure. All rights reserved.</p>
            <nav className="flex gap-4">
              <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" href="#">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg transition-transform hover:scale-105">
      <CheckCircle className="h-12 w-12 mb-4 text-slate-400" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

