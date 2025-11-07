/**
 * BilanCompetence.AI - useAuth Hook
 * Authentication hook
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useStore } from '@/store'

export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, setUser, clearAuth } = useStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        clearAuth()
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) {
      setUser(data)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    clearAuth()
    router.push('/login')
  }

  return {
    user,
    isAuthenticated,
    signOut,
  }
}
