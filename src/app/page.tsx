/**
 * BilanCompetence.AI - Homepage
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary to-secondary-light">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6">
              BilanCompetence.AI
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              La plateforme digitale pour réaliser vos bilans de compétences
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Accompagnez vos bénéficiaires avec une solution moderne, conforme Qualiopi,
              et enrichie par l'intelligence artificielle
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-secondary bg-primary hover:bg-primary-dark rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-surface/10 hover:bg-surface/20 border-2 border-white/30 rounded-lg transition-all"
            >
              Se connecter
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">IA Intégrée</h3>
              <p className="text-gray-200">
                Analyse automatique des compétences avec Google Gemini
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Conforme Qualiopi</h3>
              <p className="text-gray-200">
                Traçabilité et indicateurs intégrés
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Dashboard Complet</h3>
              <p className="text-gray-200">
                Suivi en temps réel de tous vos bilans
              </p>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="mt-16 text-gray-300">
            <p className="text-sm">
              À partir de 49€/mois • Sans engagement • Conforme RGPD
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
