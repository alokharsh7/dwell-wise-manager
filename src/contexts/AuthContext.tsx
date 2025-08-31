import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: any | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
        return
      }

      // No profile found: create one using current session user metadata
      try {
        const { data: userData } = await supabase.auth.getUser()
        const currentUser = userData?.user
        const email = currentUser?.email || null
        const firstName = (currentUser?.user_metadata as any)?.first_name || null
        const lastName = (currentUser?.user_metadata as any)?.last_name || null

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName,
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating profile:', insertError)
          return
        }

        setProfile(inserted)
      } catch (e) {
        console.error('Error creating missing profile:', e)
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error)
    }
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Defer profile fetching to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id)
          }, 0)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id)
        }, 0)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Clean up any stale Supabase auth state to prevent limbo states
  const cleanupAuthState = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key)
        }
      })
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key)
        }
      })
    } catch {}
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Ensure clean state before new sign-in
      cleanupAuthState()
      try { await supabase.auth.signOut({ scope: 'global' as any }) } catch {}

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      cleanupAuthState()
      const { error } = await supabase.auth.signOut({ scope: 'global' as any })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    session,
    profile,
    signIn,
    signUp,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}