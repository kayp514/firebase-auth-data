import React from 'react'

export function InstallationGuide() {
  return (
    <section id="installation" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Quick Start</h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">1. Install the package</h3>
            <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="language-bash">
                  <span className="text-[#dcdcaa]">npm</span> <span className="text-[#9cdcfe]">install</span> <span className="text-[#ce9178]">@tern-secure/nextjs@latest</span>
                </code>
              </pre>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">2. Set up TernSecureProvider</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Import and set up TernSecure in your Next.js App Router project:
            </p>
            <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="language-typescript">
                  {`// app/layout.tsx
import { TernSecureProvider } from '@tern-secure/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TernSecureProvider>
          {children}
        </TernSecureProvider>
      </body>
    </html>
  )
}`.split('\n').map((line, i) => (
    <div key={i} className="whitespace-pre">
      {line.startsWith('//') ? (
        <span className="text-[#6A9955]">{line}</span>
      ) : line.includes('import') ? (
        <>
          <span className="text-[#C586C0]">import </span>
          <span className="text-[#9CDCFE]">{ '{TernSecureProvider}' }</span>
          <span className="text-[#C586C0]"> from </span>
          <span className="text-[#CE9178]">'@tern-secure/nextjs'</span>
        </>
      ) : line.includes('export default function') ? (
        <>
          <span className="text-[#569CD6]">export default </span>
          <span className="text-[#569CD6]">function </span>
          <span className="text-[#DCDCAA]">RootLayout </span>
          <span className="text-[#DCDCAA]">(</span>
            <span className="text-[#9CDCFE]">{'{'}</span>
        </>
      ) : line.match(/^[\s]*<\/?(html|body|TernSecureProvider).*>/) ? (
        <span className="text-[#569CD6]">{line}</span>
      ) : line.includes('{children}') ? (
        <>
          <span className="text-[#D4D4D4]">          {'{'}</span>
          <span className="text-[#9CDCFE]">children</span>
          <span className="text-[#D4D4D4]">{'}'}</span>
        </>
      ) : (
        <span className="text-[#D4D4D4]">{line}</span>
      )}
    </div>
  ))}
                </code>
              </pre>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">3. Use TernSecure in a client-side component</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Import and use TernSecure hooks in your client-side components:
            </p>
            <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                <code className="language-typescript">
                  {`// app/page.tsx
'use client'

import { useAuth } from '@tern-secure/nextjs'

export default function Home() {
  const { user, isLoaded } = useAuth()

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
        <p>Welcome, {user.email}!</p>
    </div>
  );
}`.split('\n').map((line, i) => (
    <div key={i} className="whitespace-pre">
      {line.startsWith('//') ? (
        <span className="text-[#6A9955]">{line}</span>
      ) : line.includes("'use client'") ? (
        <span className="text-[#CE9178]">{'\'use client\''}</span>
      ) : line.includes('import') ? (
        <>
          <span className="text-[#C586C0]">import </span>
          <span className="text-[#9CDCFE]">{'{ useAuth }'}</span>
          <span className="text-[#C586C0]"> from </span>
          <span className="text-[#CE9178]">'@tern-secure/nextjs'</span>
        </>
      ) : line.includes('export default function') ? (
        <>
          <span className="text-[#569CD6]">export default </span>
          <span className="text-[#569CD6]">function </span>
          <span className="text-[#DCDCAA]">Home</span>
          <span className="text-[#DCDCAA]">(</span>
          <span className="text-[#DCDCAA]">)</span>
        </>
      ) : line.includes('const {') ? (
        <>
          <span className="text-[#569CD6]">  const </span>
          <span className="text-[#9CDCFE]">{'{ user, isLoaded'}</span>
          <span className="text-[#D4D4D4]"> = </span>
          <span className="text-[#DCDCAA]">useAuth</span>
          <span className="text-[#DCDCAA]">()</span>
        </>
      ) : line.includes('if (!isLoaded)') ? (
        <>
          <span className="text-[#C586C0]">  if </span>
          <span className="text-[#DCDCAA]">(</span>
          <span className="text-[#D4D4D4]">!</span>
          <span className="text-[#9CDCFE]">isLoaded</span>
          <span className="text-[#DCDCAA]">)</span>
          <span className="text-[#C586C0]"> return </span>
          <span className="text-[#569CD6]">{'<div>'}</span>
          <span className="text-[#D4D4D4]">Loading...</span>
          <span className="text-[#569CD6]">{'</div>'}</span>
        </>
      ) : line.includes('return (') ? (
        <>
          <span className="text-[#C586C0]">  return </span>
          <span className="text-[#DCDCAA]">(</span>
        </>
      ) : line.match(/^[\s]*<\/?div>/) ? (
        <span className="text-[#569CD6]">{line}</span>
      ) : line.includes('isAuthenticated ?') ? (
        <>
          <span className="text-[#D4D4D4]">      </span>
          <span className="text-[#9CDCFE]">{'{'}</span>
          <span className="text-[#D4D4D4]"> ? </span>
          <span className="text-[#F44747]">(</span>
        </>
      ) : line.includes('<p>Welcome,') ? (
        <>
          <span className="text-[#569CD6]">        {'<p>'}</span>
          <span className="text-[#D4D4D4]">Welcome, </span>
          <span className="text-[#9CDCFE]">{'{'}</span>
          <span className="text-[#9CDCFE]">user</span>
          <span className="text-[#D4D4D4]">.</span>
          <span className="text-[#9CDCFE]">email</span>
          <span className="text-[#9CDCFE]">{'}'}</span>
          <span className="text-[#D4D4D4]">!</span>
          <span className="text-[#569CD6]">{'</p>'}</span>
        </>
      ) : line.includes('<p>Please') ? (
        <span className="text-[#569CD6]">        {'<p>'}Please sign in{'</p>'}</span>
      ) : line.trim() === ') : (' ? (
        <>
          <span className="text-[#F44747]">)</span>
          <span className="text-[#D4D4D4]"> : </span>
          <span className="text-[#F44747]">(</span>
        </>
      ) : line.includes(')}') ? (
        <>
          <span className="text-[#F44747]">)</span>
          <span className="text-[#9CDCFE]">{'}'}</span>
        </>
      ) : (
        <span className="text-[#D4D4D4]">{line}</span>
      )}
    </div>
  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

