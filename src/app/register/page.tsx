/**
 * BilanCompetence.AI - Register Page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { UserType } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    user_type: 'consultant' as UserType,
    organisme_name: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            user_type: formData.user_type,
          },
        },
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (!authData.user) {
        toast.error('Erreur lors de la création du compte')
        return
      }

      // 2. Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          user_type: formData.user_type,
        })

      if (userError) {
        console.error('User creation error:', userError)
      }

      // 3. If consultant/organisme_admin, create organisme
      if (formData.user_type === 'consultant' || formData.user_type === 'organisme_admin') {
        const { data: organismeData, error: organismeError } = await supabase
          .from('organismes')
          .insert({
            name: formData.organisme_name || `${formData.first_name} ${formData.last_name}`,
            admin_id: authData.user.id,
          })
          .select()
          .single()

        if (organismeError) {
          console.error('Organisme creation error:', organismeError)
        }

        // 4. Create consultant record
        if (formData.user_type === 'consultant' && organismeData) {
          await supabase
            .from('consultants')
            .insert({
              user_id: authData.user.id,
              organisme_id: organismeData.id,
            })
        }
      }

      toast.success('Compte créé avec succès! Vérifiez votre email.')
      router.push('/login')
    } catch (error: any) {
      toast.error('Erreur lors de l\'inscription')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Créer un compte
          </h1>
          <p className="text-text-light">
            Rejoignez BilanCompetence.AI
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="label">
                Prénom
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="last_name" className="label">
                Nom
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email professionnel
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="votre@email.fr"
              required
            />
          </div>

          <div>
            <label htmlFor="user_type" className="label">
              Vous êtes
            </label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="consultant">Consultant indépendant</option>
              <option value="organisme_admin">Organisme de formation</option>
            </select>
          </div>

          {(formData.user_type === 'consultant' || formData.user_type === 'organisme_admin') && (
            <div>
              <label htmlFor="organisme_name" className="label">
                Nom de l'organisme (optionnel)
              </label>
              <input
                id="organisme_name"
                name="organisme_name"
                type="text"
                value={formData.organisme_name}
                onChange={handleChange}
                className="input"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-text-light mt-1">
              Minimum 8 caractères
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-light">
            Déjà un compte?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
