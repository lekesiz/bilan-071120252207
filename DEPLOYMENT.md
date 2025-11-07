# Guide de Déploiement - BilanCompetence.AI

## 📋 Prérequis

- [ ] Compte GitHub avec le repository
- [ ] Compte Vercel (gratuit)
- [ ] Projet Supabase créé
- [ ] Compte Stripe
- [ ] Compte SendGrid
- [ ] API Key Google Gemini

---

## 🚀 Déploiement - Étape par Étape

### 1. Supabase (Database & Auth)

#### 1.1 Créer le projet Supabase

```bash
# Aller sur https://supabase.com/dashboard
# Créer un nouveau projet
# Choisir région: Europe (Frankfurt) pour la conformité RGPD
# Attendre 2-3 minutes pour la création
```

#### 1.2 Exécuter les migrations

```bash
# Dans Supabase Dashboard > SQL Editor
# Exécuter dans l'ordre:
1. supabase/migrations/20250101000001_create_tables.sql
2. supabase/migrations/20250101000002_create_indexes.sql
3. supabase/migrations/20250101000003_create_rls_policies.sql
4. supabase/migrations/20250101000004_seed_competences.sql
```

#### 1.3 Configurer Authentication

```bash
# Settings > Authentication
- Enable Email Provider ✅
- Disable Email Confirmations (ou configurer SendGrid)
- Site URL: https://votre-domaine.com
- Redirect URLs: https://votre-domaine.com/auth/callback
```

#### 1.4 Configurer Storage

```bash
# Storage > Create new bucket
Bucket name: documents
Public: false (private)
File size limit: 10MB
Allowed MIME types: application/pdf, image/jpeg, image/png
```

#### 1.5 Récupérer les credentials

```bash
# Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb... (⚠️ Secret!)
```

---

### 2. Vercel (Hosting)

#### 2.1 Connecter le repository

```bash
# 1. Aller sur https://vercel.com/new
# 2. Import Git Repository
# 3. Sélectionner: lekesiz/bilan-071120252207
# 4. Framework Preset: Next.js (auto-détecté)
# 5. Root Directory: ./
# 6. Ne pas encore déployer - configurer les variables d'abord
```

#### 2.2 Configurer les variables d'environnement

```bash
# Settings > Environment Variables
# Ajouter TOUTES les variables de .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# NextAuth
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=[Générer: openssl rand -base64 32]

# Stripe (voir étape 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# SendGrid (voir étape 4)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@votre-domaine.com
SENDGRID_FROM_NAME=BilanCompetence.AI

# Gemini (voir étape 5)
GEMINI_API_KEY=AIza...

# App
NEXT_PUBLIC_APP_URL=https://votre-projet.vercel.app
NEXT_PUBLIC_APP_NAME=BilanCompetence.AI
```

#### 2.3 Déployer

```bash
# Dans Vercel Dashboard
# Deployments > Redeploy
# Ou automatique sur chaque push GitHub
```

---

### 3. Stripe (Paiements)

#### 3.1 Créer les produits

```bash
# Dashboard Stripe > Products > Add Product

# Produit 1: Starter
Name: Starter
Price: 49€/mois
Billing period: Mensuel
Copier le Price ID: price_xxxxx

# Produit 2: Professional
Name: Professional
Price: 149€/mois
Billing period: Mensuel
Copier le Price ID: price_xxxxx

# Produit 3: Enterprise
Name: Enterprise
Price: 499€/mois
Billing period: Mensuel
Copier le Price ID: price_xxxxx
```

#### 3.2 Configurer le Webhook

```bash
# Developers > Webhooks > Add endpoint
Endpoint URL: https://votre-projet.vercel.app/api/webhooks/stripe

Events to send:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed

Copier le Webhook Secret: whsec_xxxxx
```

#### 3.3 Récupérer les clés

```bash
# Developers > API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... (⚠️ Secret!)
```

---

### 4. SendGrid (Emails)

#### 4.1 Créer une API Key

```bash
# Settings > API Keys > Create API Key
Name: BilanCompetence Production
Permissions: Full Access
Copier la clé: SG.xxxxx (⚠️ Une seule fois!)
```

#### 4.2 Vérifier le domaine

```bash
# Settings > Sender Authentication > Domain Authentication
Domaine: votre-domaine.com
Ajouter les DNS records (CNAME) chez votre hébergeur
Vérifier après 24-48h
```

#### 4.3 Configurer l'expéditeur

```bash
# Settings > Sender Authentication
Email: noreply@votre-domaine.com
From Name: BilanCompetence.AI
```

---

### 5. Google Gemini (AI)

#### 5.1 Obtenir l'API Key

```bash
# Aller sur https://makersuite.google.com/app/apikey
# Créer un projet ou sélectionner existant
# "Get API Key" > "Create API key"
# Copier: AIza...xxxxx
```

#### 5.2 Activer la facturation

```bash
# Console Google Cloud
# Billing > Link billing account
# Gemini 1.5 Flash: $0.35/million tokens
```

---

### 6. Domaine Personnalisé (Optionnel)

#### 6.1 Acheter un domaine

```bash
# Recommandations:
- Namecheap
- OVH
- Google Domains

Suggestions:
- bilancompetence.ai
- monbilan.pro
- competence360.fr
```

#### 6.2 Configurer dans Vercel

```bash
# Vercel > Settings > Domains
# Add Domain: votre-domaine.com

# Ajouter les DNS records chez votre registrar:
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 6.3 Configurer SSL

```bash
# Automatique avec Vercel
# Certificat Let's Encrypt
# Renouvellement automatique
```

---

## 🔒 Post-Déploiement - Sécurité

### Checklist de Sécurité

- [ ] Toutes les variables d'environnement en place
- [ ] SUPABASE_SERVICE_ROLE_KEY jamais exposé côté client
- [ ] Stripe en mode Live (pas Test)
- [ ] HTTPS activé (automatique avec Vercel)
- [ ] RLS policies actives sur Supabase
- [ ] CORS configuré correctement
- [ ] Rate limiting activé (Vercel Pro)
- [ ] Monitoring d'erreurs (Sentry recommandé)

### Tester l'authentification

```bash
# 1. Créer un compte
https://votre-domaine.com/register

# 2. Vérifier dans Supabase
# Authentication > Users
# Voir le nouvel utilisateur

# 3. Vérifier les tables
# Table Editor > users
# Voir l'entrée correspondante
```

### Tester les paiements (Mode Test d'abord)

```bash
# Stripe Dashboard > Mode Test
# Utiliser les cartes de test:
4242 4242 4242 4242 (Succès)
4000 0000 0000 9995 (Échec)

# Vérifier le webhook
Developers > Webhooks > Votre endpoint
Voir les events reçus
```

---

## 📊 Monitoring

### Vercel Analytics (Intégré)

```bash
# Vercel Dashboard > Analytics
- Page views
- Performance metrics
- Web Vitals
```

### Sentry (Recommandé pour les erreurs)

```bash
# 1. Créer compte sur sentry.io
# 2. Créer projet Next.js
# 3. Installer:
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# 4. Ajouter dans Vercel
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Uptime Monitoring

```bash
# UptimeRobot (Gratuit)
# Monitorer: https://votre-domaine.com
# Alertes email si down
```

---

## 💰 Coûts Mensuels Estimés

### Démarrage (0-50 utilisateurs)

| Service | Plan | Coût |
|---------|------|------|
| Vercel | Hobby | **Gratuit** |
| Supabase | Free | **Gratuit** (500MB DB) |
| Stripe | Pay-as-you-go | **0.25€ + 1.4%** par transaction |
| SendGrid | Free | **Gratuit** (100 emails/jour) |
| Gemini | Pay-per-use | **~5-10€** (selon usage) |
| Domaine | Annuel | **~10€/an** |
| **TOTAL** | | **~15-20€/mois** |

### Croissance (50-500 utilisateurs)

| Service | Plan | Coût |
|---------|------|------|
| Vercel | Pro | **20$/mois** |
| Supabase | Pro | **25$/mois** (8GB DB) |
| Stripe | Pay-as-you-go | **Variable** |
| SendGrid | Essentials | **20$/mois** (50k emails) |
| Gemini | Pay-per-use | **~50-100€** |
| Sentry | Team | **26$/mois** |
| **TOTAL** | | **~150-200€/mois** |

### Scale (500+ utilisateurs)

| Service | Plan | Coût |
|---------|------|------|
| Vercel | Pro | **20$/mois** |
| Supabase | Pro | **25-100$/mois** (selon DB) |
| Stripe | Pay-as-you-go | **Variable** |
| SendGrid | Pro | **90$/mois** (100k emails) |
| Gemini | Pay-per-use | **~200-500€** |
| Sentry | Business | **80$/mois** |
| **TOTAL** | | **~500-800€/mois** |

---

## 🔄 CI/CD Automatique

Le projet inclut déjà GitHub Actions (`.github/workflows/ci.yml`):

### À chaque Push:
1. ✅ Lint (ESLint)
2. ✅ Type-check (TypeScript)
3. ✅ Tests (Jest)
4. ✅ Build (Next.js)
5. ✅ Security scan (npm audit)

### À chaque PR:
1. Vercel Preview Deployment
2. URL de preview unique
3. Tests automatiques

### Sur merge main:
1. Déploiement production automatique
2. Invalidation du cache
3. Health check

---

## 🆘 Troubleshooting

### Erreur "Database connection failed"

```bash
# Vérifier les variables Supabase
# Vérifier que les migrations sont exécutées
# Vérifier les RLS policies
```

### Erreur Stripe Webhook "Invalid signature"

```bash
# Vérifier STRIPE_WEBHOOK_SECRET
# Vérifier l'URL du webhook dans Stripe Dashboard
# Vérifier que le webhook écoute les bons events
```

### Erreur "Email not sent"

```bash
# Vérifier SENDGRID_API_KEY
# Vérifier que le domaine est vérifié
# Vérifier les quotas SendGrid
```

### Build failed sur Vercel

```bash
# Vérifier les variables d'environnement
# Vérifier npm run build en local
# Regarder les logs Vercel
```

---

## 📝 Post-Launch Checklist

- [ ] Domaine personnalisé configuré
- [ ] SSL actif (HTTPS)
- [ ] Toutes les variables d'environnement en production
- [ ] Stripe en mode Live
- [ ] Webhooks Stripe testés
- [ ] Emails de test envoyés et reçus
- [ ] Créer un compte test complet
- [ ] Créer un bilan test complet
- [ ] Test de paiement en mode Live
- [ ] Monitoring activé (Sentry)
- [ ] Uptime monitoring configuré
- [ ] Backups Supabase activés
- [ ] Documentation mise à jour
- [ ] Équipe formée sur l'admin
- [ ] CGU/CGV/Politique de confidentialité en place
- [ ] Conformité RGPD vérifiée
- [ ] Support client configuré

---

## 📞 Support & Ressources

- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Next.js**: https://nextjs.org/docs
- **SendGrid**: https://docs.sendgrid.com

---

## 🎉 C'est Prêt!

Votre plateforme BilanCompetence.AI est maintenant en production!

URL: https://votre-domaine.com

Prochaines étapes:
1. Tester tous les flux utilisateurs
2. Inviter les premiers clients bêta
3. Collecter les retours
4. Itérer et améliorer

**Bon lancement! 🚀**
