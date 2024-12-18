//app/page.tsx
'use client'
import { useState } from "react"
import { redirect } from "next/navigation"
import { useAuth, useCurrentUser, useSession, useIdToken } from "../providers/TernSecureProvider"



export default function MoPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserDataExpanded, setIsUserDataExpanded] = useState(false);
  const [isTokenDataExpanded, setIsTokenDataExpanded] = useState(false);
  const { authState } = useAuth()

  const { isSignedIn, loading, userId } = authState
  const { currentUser, loading: userLoading } = useCurrentUser()
  const { accessToken, expirationTime, status, isLoading } = useSession()
  const { tokenResult, loading: tokenLoading, error, refreshToken } = useIdToken()

  const userDataToDisplay = currentUser ? 
  Object.fromEntries(
    Object.entries(currentUser).filter(([_, value]) => 
      value !== null && typeof value !== 'function'
    )
  ) : null

  if(loading){
    return <div>Loading...</div>
  }

  if(!isSignedIn){
    redirect('/sign-in')
  }

  return (
    <main className="container mx-auto p-4 space-y-4">
      <div>This is the home page</div>
      
      <div className="bg-fuchsia-600 p-4 rounded shadow-lg">
        <button 
          onClick={() => setIsUserDataExpanded(!isUserDataExpanded)}
          className="w-full flex justify-between items-center text-white font-semibold"
        >
          <span>useCurrentUser hook: Current user: {currentUser?.email}</span>
          <span>{isUserDataExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isUserDataExpanded && userDataToDisplay && (
          <div className="mt-4 bg-fuchsia-700 p-4 rounded">
            <pre className="text-sm text-white whitespace-pre-wrap break-words overflow-auto max-h-96">
              {JSON.stringify(userDataToDisplay, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <h1 className="text-sm font-semibold bg-green-600">useAuth hook: isSignedIn:, {isSignedIn ? userId : 'not signed in'}! </h1>
      
      <div className="bg-sky-600 p-4 rounded shadow-lg">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center text-white font-semibold"
        >
          <span>Session Details</span>
          <span>{isExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isExpanded && (
          <div className="mt-4 bg-sky-700 p-4 rounded">
            <ul className="space-y-2 text-white">
              <li className="flex flex-col">
                <span className="font-semibold">Access Token:</span>
                <span className="text-sm break-all">{accessToken}</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Status:</span>
                <span className="text-sm">{status}</span>
              </li>

              <li className="flex flex-col">
                <span className="font-semibold">Expiration time:</span>
                <span className="text-sm">
                  {expirationTime ? new Date(expirationTime).toLocaleString() : 'N/A'}
                </span>
              </li>
              {userId && (
                <li className="flex flex-col">
                  <span className="font-semibold">User ID:</span>
                  <span className="text-sm">{userId}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-purple-600 p-4 rounded shadow-lg">
        <button 
          onClick={() => setIsTokenDataExpanded(!isTokenDataExpanded)}
          className="w-full flex justify-between items-center text-white font-semibold"
        >
          <span>ID Token Details</span>
          <span>{isTokenDataExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isTokenDataExpanded && tokenResult && (
          <div className="mt-4 bg-purple-700 p-4 rounded">
            <div className="flex justify-end mb-2">
              <button 
                onClick={refreshToken}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-400"
              >
                Refresh Token
              </button>
            </div>
            <pre className="text-sm text-white whitespace-pre-wrap break-words overflow-auto max-h-96">
              {JSON.stringify({
                token: tokenResult.token,
                claims: tokenResult.claims,
                issuedAt: tokenResult.issuedAtTime,
                expiration: tokenResult.expirationTime,
                authTime: tokenResult.authTime,
                provider: tokenResult.signInProvider
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}