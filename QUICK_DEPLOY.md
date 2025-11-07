# 🚀 Déploiement Rapide - 15 minutes

Guide ultra-rapide pour mettre BilanCompetence.AI en production.

## ⚡ Setup Express (15 min)

### 1. Supabase (3 min)

```bash
# 1. Créer projet: https://supabase.com/dashboard/new
# 2. Région: Europe (Frankfurt)
# 3. SQL Editor > Coller et exécuter chaque fichier dans supabase/migrations/
# 4. Settings > API > Copier les credentials
```

### 2. Vercel (2 min)

```bash
# 1. https://vercel.com/new
# 2. Import: lekesiz/bilan-071120252207
# 3. Ne pas déployer encore!
```

### 3. Variables d'environnement (5 min)

```bash
# Dans Vercel > Settings > Environment Variables
# Coller ces valeurs minimales pour démarrer:

NEXT_PUBLIC_SUPABASE_URL=https://[VOTRE-PROJET].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[CLE-PUBLIQUE-SUPABASE]
SUPABASE_SERVICE_ROLE_KEY=[CLE-SERVICE-SUPABASE]

NEXTAUTH_URL=https://[VOTRE-PROJET].vercel.app
NEXTAUTH_SECRET=[Générer: openssl rand -base64 32]

NEXT_PUBLIC_APP_URL=https://[VOTRE-PROJET].vercel.app
NEXT_PUBLIC_APP_NAME=BilanCompetence.AI

# Optionnel pour démarrer (ajouter plus tard):
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
GEMINI_API_KEY=AIza...
```

### 4. Déployer (1 min)

```bash
# Dans Vercel > Deployments > Deploy
# Attendre 2-3 min
# ✅ LIVE!
```

### 5. Tester (4 min)

```bash
# 1. Aller sur: https://[VOTRE-PROJET].vercel.app
# 2. Cliquer "S'inscrire"
# 3. Créer un compte consultant
# 4. Accéder au dashboard
# 5. ✅ Ça marche!
```

---

## 🎯 Prochaines Étapes

Une fois le MVP en ligne, configurer:

### Paiements (Stripe)

```bash
# 1. Créer les 3 produits dans Stripe Dashboard
# 2. Copier les Price IDs
# 3. Configurer le webhook: https://[VOTRE-PROJET].vercel.app/api/webhooks/stripe
# 4. Ajouter les variables dans Vercel
```

### Emails (SendGrid)

```bash
# 1. Créer une API Key
# 2. Vérifier le domaine
# 3. Ajouter SENDGRID_API_KEY dans Vercel
```

### AI (Gemini)

```bash
# 1. https://makersuite.google.com/app/apikey
# 2. Créer une API Key
# 3. Ajouter GEMINI_API_KEY dans Vercel
```

### Domaine Personnalisé

```bash
# 1. Acheter un domaine
# 2. Vercel > Settings > Domains > Add
# 3. Configurer les DNS
# 4. SSL automatique ✅
```

---

## 📋 Checklist MVP Minimum

Pour une démo fonctionnelle:

- [x] ✅ Code source complet
- [ ] 🟡 Supabase configuré
- [ ] 🟡 Vercel déployé
- [ ] 🟡 Variables d'environnement (minimum)
- [ ] 🟡 Compte test créé

**Temps total: 15 minutes**

---

## 📋 Checklist Production Complète

Pour lancer en production:

- [ ] ✅ Domaine personnalisé
- [ ] ✅ SSL activé
- [ ] ✅ Stripe en mode Live
- [ ] ✅ SendGrid configuré
- [ ] ✅ Gemini activé
- [ ] ✅ Monitoring (Sentry)
- [ ] ✅ Backups configurés
- [ ] ✅ CGU/CGV en place
- [ ] ✅ RGPD compliance

**Temps total: 2-3 heures**

---

## 🆘 Problèmes Courants

### "Database connection failed"

```bash
# Vérifier NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
# Vérifier que les migrations sont exécutées
```

### "Build failed"

```bash
# Vérifier que TOUTES les variables requises sont définies
# Regarder les logs Vercel pour l'erreur exacte
```

### "Cannot sign up"

```bash
# Supabase > Authentication > Providers
# Vérifier que Email Provider est activé
```

---

## 💡 Tips

1. **Commencez simple**: Déployez d'abord avec le strict minimum (Supabase + Vercel)
2. **Testez**: Créez un compte et un bilan test
3. **Ajoutez progressivement**: Stripe, puis SendGrid, puis Gemini
4. **Monitorer**: Vercel Analytics est inclus gratuitement

---

## 📞 Besoin d'aide?

Voir le guide complet: `DEPLOYMENT.md`

**🎉 Bon déploiement!**
