# BilanCompetence.AI - MVP

**Plateforme digitale de bilans de compétences pour professionnels français**

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

---

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Documentation](#documentation)
- [Licence](#licence)

---

## À propos

BilanCompetence.AI est une plateforme SaaS innovante qui digitalise le processus de bilan de compétences en France. En s'appuyant sur l'intelligence artificielle (Google Gemini) et les données publiques de France Travail, elle devient la référence du marché pour les organismes de formation, consultants indépendants et bénéficiaires en reconversion professionnelle.

### Objectifs

- ✅ Digitaliser le processus de bilan de compétences
- ✅ Conformité Qualiopi native
- ✅ Analyse IA des compétences
- ✅ Interface intuitive pour 3 types d'utilisateurs
- ✅ Génération automatique de documents PDF

---

## Fonctionnalités

### MVP (Version 0.1.0)

#### Pour les Consultants
- ✅ Gestion de bilans multiples
- ✅ Évaluation des compétences (auto + consultant)
- ✅ Génération de PDF de synthèse
- ✅ Messagerie interne avec bénéficiaires
- ✅ Planification de rendez-vous

#### Pour les Bénéficiaires
- ✅ Auto-évaluation guidée des compétences
- ✅ Suivi de la progression
- ✅ Communication avec consultant
- ✅ Accès au document de synthèse

#### Pour les Organismes
- ✅ Tableau de bord des bilans
- ✅ Gestion des consultants
- ✅ Statistiques et rapports
- ✅ Abonnements Stripe (Starter, Professional, Enterprise)

### Fonctionnalités futures (v2.0+)
- ⏳ Intégration France Travail API
- ⏳ Analyse IA avancée (recommandations métiers ROME)
- ⏳ Visioconférence intégrée
- ⏳ Application mobile (iOS/Android)
- ⏳ Marketplace de consultants certifiés

---

## Stack technique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TailwindCSS 3
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Notifications**: React Hot Toast

### Backend
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth (JWT + RLS)
- **Storage**: Supabase Storage
- **API**: Next.js API Routes

### Intégrations
- **IA**: Google Gemini 1.5 Flash
- **Paiements**: Stripe
- **Email**: SendGrid
- **PDF**: Puppeteer / jsPDF

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry (optionnel)

---

## Installation

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Compte Supabase
- Compte Google Cloud (Gemini API)
- Compte Stripe (test mode OK)

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/netzinformatique/bilan-competence.git
cd bilan-competence

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env.local

# 4. Éditer .env.local avec vos clés API
# (Voir section Configuration ci-dessous)

# 5. Démarrer Supabase local (optionnel)
npm run supabase:start

# 6. Appliquer les migrations
npm run db:migrate

# 7. Seed la base de données
npm run db:seed

# 8. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Configuration

### Variables d'environnement (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Authentification
NEXTAUTH_SECRET=your-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google Gemini
GOOGLE_GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx...
EMAIL_FROM=noreply@bilancompetence.ai
```

Voir `.env.example` pour la liste complète.

---

## Développement

### Structure du projet

```
bilan-competence-ai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Pages dashboard
│   │   └── login/            # Pages auth
│   ├── components/           # Composants React
│   │   ├── Common/           # Boutons, Cards, etc.
│   │   ├── Dashboard/        # Dashboard components
│   │   └── Bilan/            # Bilan-specific
│   ├── lib/                  # Utilitaires
│   │   ├── supabase/         # Clients Supabase
│   │   ├── gemini/           # Intégration IA
│   │   └── stripe/           # Paiements
│   ├── types/                # Types TypeScript
│   ├── hooks/                # Custom hooks
│   ├── utils/                # Helpers
│   └── styles/               # CSS globaux
├── supabase/
│   └── migrations/           # SQL migrations
├── scripts/                  # Scripts utilitaires
└── public/                   # Assets statiques
```

### Scripts disponibles

```bash
npm run dev              # Serveur de développement
npm run build            # Build production
npm run start            # Serveur production
npm run lint             # Linter
npm run type-check       # Vérification TypeScript
npm run test             # Tests unitaires
npm run test:e2e         # Tests E2E (Playwright)
npm run db:migrate       # Migrations Supabase
npm run db:seed          # Seed data
```

---

## Tests

### Tests unitaires (Jest)

```bash
npm run test
npm run test:watch       # Mode watch
```

### Tests E2E (Playwright)

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test -- --coverage
```

**Objectifs de couverture:**
- Unit tests: 80%
- Integration tests: 70%
- E2E tests: 40% (critical user journeys)

---

## Déploiement

### 🚀 Déploiement Rapide (15 minutes)

Pour un déploiement express, suivez notre guide rapide:

```bash
📖 Voir: QUICK_DEPLOY.md
```

**Étapes essentielles:**
1. Créer un projet Supabase
2. Exécuter les migrations SQL
3. Déployer sur Vercel avec variables d'environnement
4. Tester la connexion

### 📚 Déploiement Complet (Production)

Pour un guide détaillé avec toutes les étapes de production:

```bash
📖 Voir: DEPLOYMENT.md
```

**Inclut:**
- Configuration Supabase (Database, Auth, Storage, RLS)
- Déploiement Vercel avec CI/CD
- Configuration Stripe (webhooks, produits)
- Configuration SendGrid (emails)
- Configuration Google Gemini (AI)
- Domaine personnalisé et SSL
- Monitoring et sécurité
- Estimation des coûts
- Troubleshooting

### 🔍 Vérification pré-déploiement

Avant de déployer, vérifiez que tout est prêt:

```bash
# Exécuter le script de vérification
./scripts/deploy-check.sh
```

Ce script vérifie:
- ✅ Version Node.js
- ✅ Dépendances installées
- ✅ Variables d'environnement
- ✅ TypeScript type-check
- ✅ Linting
- ✅ Tests
- ✅ Build production
- ✅ Fichiers critiques
- ✅ Git status
- ✅ Security audit

### 📊 Plateformes Recommandées

| Service | Recommandation | Pourquoi |
|---------|----------------|----------|
| **Hosting** | Vercel | Optimal pour Next.js, déploiement automatique |
| **Database** | Supabase | PostgreSQL managé, Auth intégré, RLS |
| **Storage** | Supabase Storage | Intégré avec la DB, RGPD-compliant |
| **Payments** | Stripe | Standard SaaS, webhooks fiables |
| **Emails** | SendGrid | 100 emails/jour gratuits, bonne délivrabilité |
| **AI** | Google Gemini | Pay-per-use, pas d'infra requise |
| **Monitoring** | Sentry | Tracking d'erreurs production |

### 🔐 Variables d'environnement (Production)

Configuration minimale pour Vercel:

```bash
# Essentielles
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=[générer avec: openssl rand -base64 32]
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

Voir `.env.example` pour la liste complète (40+ variables).

### 🔄 CI/CD Automatique

Le projet inclut GitHub Actions (`.github/workflows/ci.yml`):

**À chaque Push:**
- ✅ Lint (ESLint)
- ✅ Type-check (TypeScript)
- ✅ Tests (Jest)
- ✅ Build (Next.js)
- ✅ Security scan (npm audit, Snyk)

**À chaque PR:**
- 🔍 Vercel Preview Deployment
- 🔍 Tests automatiques

**Sur merge main:**
- 🚀 Déploiement production automatique

---

## Documentation

- [Cahier des Charges](./docs/Cahier_des_Charges.md)
- [Architecture technique](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Guide de contribution](./CONTRIBUTING.md)

---

## Sécurité

### Conformité

- ✅ **RGPD**: Consentement, droit à l'oubli, portabilité
- ✅ **RGAA 4.1**: Accessibilité niveau AA
- ✅ **Qualiopi**: Traçabilité et indicateurs intégrés

### Sécurité des données

- ✅ Chiffrement en transit (HTTPS/TLS 1.3)
- ✅ Chiffrement au repos (Supabase AES-256)
- ✅ Row Level Security (RLS) activée
- ✅ Authentification JWT + cookies httpOnly
- ✅ Rate limiting API
- ✅ Logs d'audit complets

---

## Support

Pour toute question ou problème:
- 📧 Email: support@bilancompetence.ai
- 🐛 Issues: [GitHub Issues](https://github.com/netzinformatique/bilan-competence/issues)

---

## Équipe

- **Founder & CTO**: NETZ INFORMATIQUE
- **AI Development**: Manus AI

---

## Licence

Copyright © 2025 NETZ INFORMATIQUE. Tous droits réservés.

Ce projet est propriétaire et confidentiel. Toute reproduction, distribution ou utilisation non autorisée est strictement interdite.

---

## Changelog

### v0.1.0 (MVP - Janvier 2025)

#### ✨ Nouvelles fonctionnalités
- Authentification multi-rôles (Consultant, Bénéficiaire, Organisme)
- Gestion de bilans (CRUD)
- Auto-évaluation des compétences
- Évaluation consultant
- Génération PDF de synthèse
- Messagerie interne
- Planification de rendez-vous
- Tableau de bord (3 rôles)
- Intégration Stripe (abonnements)

#### 🛠️ Technique
- Next.js 14 (App Router)
- Supabase (Auth + DB + Storage)
- TailwindCSS 3
- TypeScript 5
- Zustand state management

#### 📚 Documentation
- README complet
- Cahier des charges stratégique
- API specs
- Database schema

---

**Fait avec ❤️ en France**
