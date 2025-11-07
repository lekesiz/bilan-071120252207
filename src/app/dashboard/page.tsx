/**
 * BilanCompetence.AI - Dashboard Page
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user data with type
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!userData) {
    redirect('/login')
  }

  // Get user stats based on role
  let stats = {
    total_bilans: 0,
    active_bilans: 0,
    unread_messages: 0,
  }

  if (userData.user_type === 'consultant') {
    const { data: consultant } = await supabase
      .from('consultants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (consultant) {
      const { count: totalCount } = await supabase
        .from('bilans')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', consultant.id)

      const { count: activeCount } = await supabase
        .from('bilans')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', consultant.id)
        .eq('status', 'in_progress')

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      stats = {
        total_bilans: totalCount || 0,
        active_bilans: activeCount || 0,
        unread_messages: unreadCount || 0,
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                Tableau de bord
              </h1>
              <p className="text-sm text-text-light mt-1">
                Bienvenue, {userData.first_name} {userData.last_name}
              </p>
            </div>
            <div>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="btn-secondary text-sm"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Total bilans</p>
                <p className="text-3xl font-bold text-secondary mt-1">
                  {stats.total_bilans}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Bilans actifs</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {stats.active_bilans}
                </p>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light">Messages non lus</p>
                <p className="text-3xl font-bold text-warning mt-1">
                  {stats.unread_messages}
                </p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn-primary">
              ➕ Nouveau bilan
            </button>
            <button className="btn-secondary">
              👥 Mes bénéficiaires
            </button>
            <button className="btn-secondary">
              📅 Rendez-vous
            </button>
            <button className="btn-secondary">
              📈 Rapports
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
          <div className="text-center py-12 text-text-light">
            <p className="text-4xl mb-4">🚀</p>
            <p className="text-lg font-medium mb-2">Bienvenue sur BilanCompetence.AI</p>
            <p className="text-sm">
              Commencez par créer votre premier bilan de compétences
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
