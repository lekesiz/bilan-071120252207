/**
 * BilanCompetence.AI - Login Page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        toast.success('Connexion réussie!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      toast.error('Erreur lors de la connexion')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            BilanCompetence.AI
          </h1>
          <p className="text-text-light">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="votre@email.fr"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-text-light">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-light">
            Pas encore de compte?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-text-light">
          <p>En vous connectant, vous acceptez nos</p>
          <div className="mt-1">
            <Link href="/terms" className="text-primary hover:underline">
              Conditions d'utilisation
            </Link>
            {' '}&{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
