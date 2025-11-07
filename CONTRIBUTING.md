# Contributing to BilanCompetence.AI

Merci de votre intérêt pour contribuer à BilanCompetence.AI! 🎉

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Guidelines de développement](#guidelines-de-développement)
- [Process de Pull Request](#process-de-pull-request)
- [Style Guide](#style-guide)

## Code de conduite

Ce projet adhère à un code de conduite. En participant, vous acceptez de respecter ce code.

## Comment contribuer

### Signaler un bug

Si vous trouvez un bug:

1. Vérifiez qu'il n'existe pas déjà dans les [Issues](https://github.com/netzinformatique/bilan-competence/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez:
   - Description détaillée
   - Steps to reproduce
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, browser, version)

### Suggérer une fonctionnalité

1. Vérifiez qu'elle n'existe pas déjà
2. Créez une issue avec le template "Feature Request"
3. Décrivez:
   - Le problème que ça résout
   - La solution proposée
   - Des alternatives considérées

### Contribuer du code

1. Fork le repository
2. Créez une branche: `git checkout -b feature/ma-feature`
3. Committez vos changements: `git commit -m 'feat: add amazing feature'`
4. Push: `git push origin feature/ma-feature`
5. Ouvrez une Pull Request

## Guidelines de développement

### Setup local

```bash
# Cloner le repo
git clone https://github.com/netzinformatique/bilan-competence.git
cd bilan-competence

# Installer les dépendances
npm install

# Setup environment
cp .env.example .env.local
# Éditer .env.local avec vos clés

# Lancer le dev server
npm run dev
```

### Structure du projet

Respectez la structure existante:

```
src/
├── app/           # Pages et routes Next.js
├── components/    # Composants React
├── lib/           # Utilitaires et clients
├── types/         # Types TypeScript
├── hooks/         # Custom React hooks
├── utils/         # Fonctions utilitaires
└── store/         # State management (Zustand)
```

### Conventions de nommage

- **Fichiers**: camelCase pour utils, PascalCase pour components
  - `Button.tsx`, `useAuth.ts`, `format.ts`
- **Components**: PascalCase
  - `BilanCard`, `EvaluationForm`
- **Hooks**: camelCase avec prefix `use`
  - `useAuth`, `useBilans`
- **Fonctions**: camelCase
  - `formatDate`, `calculateProgress`

### Tests

Tous les nouveaux features doivent inclure des tests:

```bash
# Lancer les tests
npm run test

# Avec coverage
npm run test -- --coverage

# Mode watch
npm run test:watch
```

### Commit Messages

Utilisez [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in component
docs: update README
style: format code
refactor: refactor function
test: add tests
chore: update dependencies
```

## Process de Pull Request

1. **Avant de soumettre**:
   - Tests passent: `npm run test`
   - Lint passe: `npm run lint`
   - Type-check passe: `npm run type-check`
   - Build fonctionne: `npm run build`

2. **Description de la PR**:
   - Titre clair et descriptif
   - Description des changements
   - Screenshots si UI changes
   - Lien vers l'issue si applicable

3. **Review process**:
   - Au moins 1 approbation requise
   - CI/CD doit passer (tests, lint, build)
   - Pas de merge conflicts

4. **Après merge**:
   - La branche sera supprimée automatiquement
   - Le changelog sera mis à jour

## Style Guide

### TypeScript

- Utilisez TypeScript strict mode
- Définissez des types explicites
- Évitez `any`, préférez `unknown`
- Utilisez les types du dossier `types/`

```typescript
// ✅ Good
interface UserProps {
  user: User
  onUpdate: (user: User) => void
}

// ❌ Bad
interface UserProps {
  user: any
  onUpdate: (user: any) => void
}
```

### React

- Composants fonctionnels uniquement
- Utilisez les hooks
- Props typées avec TypeScript
- Composants purs quand possible

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}
```

### CSS / TailwindCSS

- Préférez TailwindCSS pour le styling
- Utilisez les classes utilitaires définies dans `globals.css`
- Évitez le CSS inline sauf exception

```tsx
// ✅ Good
<button className="btn-primary">Cliquer</button>

// ❌ Bad
<button style={{ backgroundColor: 'blue' }}>Cliquer</button>
```

### API Routes

- Validez les inputs avec Zod
- Gérez les erreurs proprement
- Retournez des status codes appropriés
- Documentez avec JSDoc

```typescript
/**
 * GET /api/bilans
 * Get all bilans for current user
 */
export async function GET(request: NextRequest) {
  // Implementation
}
```

## Questions?

Si vous avez des questions, n'hésitez pas à:
- Ouvrir une issue
- Contacter l'équipe: support@bilancompetence.ai

Merci pour votre contribution! 🙏
