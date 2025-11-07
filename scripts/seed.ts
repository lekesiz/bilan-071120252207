#!/usr/bin/env ts-node

/**
 * BilanCompetence.AI - Database Seeding Script
 * Seeds the database with default competences and test data
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Competence {
  name: string
  category: 'Tech' | 'Business' | 'Soft' | 'Language' | 'Other'
  description: string
  is_default: boolean
}

const competences: Competence[] = [
  // Tech competences
  { name: 'JavaScript', category: 'Tech', description: 'Langage de programmation web', is_default: true },
  { name: 'TypeScript', category: 'Tech', description: 'JavaScript avec typage statique', is_default: true },
  { name: 'React', category: 'Tech', description: 'Bibliothèque JavaScript pour interfaces utilisateur', is_default: true },
  { name: 'Python', category: 'Tech', description: 'Langage de programmation polyvalent', is_default: true },
  { name: 'SQL', category: 'Tech', description: 'Langage de requête pour bases de données', is_default: true },
  { name: 'Git', category: 'Tech', description: 'Système de contrôle de version', is_default: true },
  { name: 'Docker', category: 'Tech', description: 'Plateforme de conteneurisation', is_default: true },

  // Business competences
  { name: 'Gestion de projet Agile', category: 'Business', description: 'Méthodologie de gestion de projet', is_default: true },
  { name: 'Gestion de budget', category: 'Business', description: 'Planification et contrôle financier', is_default: true },
  { name: 'Marketing digital', category: 'Business', description: 'Promotion en ligne', is_default: true },
  { name: 'Négociation commerciale', category: 'Business', description: 'Techniques de vente et négociation', is_default: true },
  { name: 'Service client', category: 'Business', description: 'Relation client', is_default: true },

  // Soft skills
  { name: 'Communication', category: 'Soft', description: 'Communication interpersonnelle efficace', is_default: true },
  { name: 'Leadership', category: 'Soft', description: 'Capacité à diriger et inspirer', is_default: true },
  { name: 'Résolution de problèmes', category: 'Soft', description: 'Approche analytique des défis', is_default: true },
  { name: 'Travail en équipe', category: 'Soft', description: 'Collaboration efficace', is_default: true },
  { name: 'Créativité', category: 'Soft', description: 'Pensée innovante et originale', is_default: true },
  { name: 'Adaptabilité', category: 'Soft', description: 'Flexibilité face au changement', is_default: true },
  { name: 'Gestion du temps', category: 'Soft', description: 'Organisation et priorisation', is_default: true },
  { name: 'Intelligence émotionnelle', category: 'Soft', description: 'Compréhension des émotions', is_default: true },

  // Languages
  { name: 'Anglais (B2 - Intermédiaire avancé)', category: 'Language', description: 'Niveau intermédiaire avancé', is_default: true },
  { name: 'Anglais (C1 - Avancé)', category: 'Language', description: 'Niveau avancé', is_default: true },
  { name: 'Espagnol', category: 'Language', description: 'Langue espagnole', is_default: true },
  { name: 'Allemand', category: 'Language', description: 'Langue allemande', is_default: true },
]

async function seed() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Seed competences
    console.log('📚 Seeding competences...')

    for (const comp of competences) {
      const { data, error } = await supabase
        .from('competences')
        .upsert(
          { ...comp },
          { onConflict: 'name,category' }
        )

      if (error) {
        console.error(`  ❌ Error seeding ${comp.name}:`, error.message)
      } else {
        console.log(`  ✅ Seeded: ${comp.name} (${comp.category})`)
      }
    }

    console.log('\n✅ Seeding completed successfully!')
    console.log(`📊 Total competences seeded: ${competences.length}`)

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
seed()
  .then(() => {
    console.log('\n🎉 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
