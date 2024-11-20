'use client'

import { createContext, useContext} from 'react'


interface TernSecureContextType {
  _contextKey: Symbol
}

const INTERNAL_CONTEXT_KEY = Symbol('INTERNAL_CONTEXT_KEY')
const TernSecureContext = createContext<TernSecureContextType | null>(null)

// Internal context hook
export const useInternalContext = (hookName: string) => {
  const context = useContext(TernSecureContext)
  if (!context || context._contextKey !== INTERNAL_CONTEXT_KEY) {
    throw new Error(
      `${hookName} cannot be used directly. ` +
      'Please import it from "@/app/providers/TernSecureProvider" instead.\n\n' +
      'Change:\n' +
      `import { ${hookName} } from "@/app/providers/internal/${hookName}"\n` +
      'To:\n' +
      `import { ${hookName} } from "@/app/providers/TernSecureProvider"`
    )
  }
  return context
}

export function TernSecureProvider({ children }: { children: React.ReactNode }) {
  return (
    <TernSecureContext.Provider value={{ 
      _contextKey: INTERNAL_CONTEXT_KEY 
    }}>
      {children}
    </TernSecureContext.Provider>
  )
}

// Export hooks
export { useAuth } from './internal/useAuth'
export { useCurrentUser } from './internal/useCurrentUser'
export { useSession } from './internal/useSession'
export { useIdToken } from './internal/useIdToken'