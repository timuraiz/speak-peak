'use client'

import { createContext, useContext } from 'react'

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  onboarding_completed?: boolean
}

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// Placeholder context - implement auth logic later
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TODO: Implement actual auth logic
  const value: AuthContextType = {
    user: null,
    profile: null,
    loading: false,
    signOut: async () => {},
    refreshProfile: async () => {},
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

