# BilanCompetence.AI - Eksik Teknik Dokümantasyon PART 2

## 🔧 BELGE 6 (Devamı): Testing Strategy

### 6.2 - Test Case Examples

#### US-1.2: Consultant registers with email
```
Test Case: TC-1.2.1
Given: New consultant landing page
When: Fill registration form with valid email + password
Then: 
  - Account created in users table with user_type='consultant'
  - Confirmation email sent to email address
  - Redirect to onboarding flow
  - Email verification link valid for 24 hours

Test Case: TC-1.2.2 (Error)
When: Try register with existing email
Then: Show "Email already registered" error (400)

Test Case: TC-1.2.3 (Security)
When: Try register with weak password (< 12 chars)
Then: Show validation error, require stronger password
```

#### US-3.2: Beneficiaire completes self-evaluation
```
Test Case: TC-3.2.1
Given: Beneficiaire on evaluation page for Bilan
When: Select competence "JavaScript", set Maitrise=4, Appetence=5, Save
Then:
  - Record created in evaluations table
  - Unsaved changes indicator removed
  - Next competence auto-loads
  - Consultant sees evaluation in dashboard

Test Case: TC-3.2.2 (Resume)
Given: Beneficiaire exits mid-evaluation
When: Return to platform after 24 hours
Then: Can resume exactly where left off (partial evaluations preserved)
```

#### US-4.1-4.4: Generate and download PDF
```
Test Case: TC-4.4.1
Given: Bilan complete with evaluations
When: Consultant clicks "Generate Synthesis"
Then:
  - PDF generated within 5 seconds
  - Contains: Beneficiaire name, all evaluations, consultant notes
  - Format: Professional, branded, downloadable
  - File stored in Supabase Storage
  - Audit log created with PDF generation action

Test Case: TC-4.4.2 (Content Validation)
When: Generate PDF
Then: Verify PDF contains:
  - Beneficiaire: [Name] [Email]
  - Evaluation summary table (competence, maitrise, appetence)
  - Consultant notes
  - Date generated
  - No personal data leaks

Test Case: TC-4.4.3 (Error Handling)
When: Generate PDF with incomplete data (missing evaluations)
Then: Show error "Please complete evaluations before generating"
```

### 6.3 - QA Checklist (Before Production Release)

#### Functionality
- [ ] All 6 MVP user stories tested (happy path)
- [ ] All error cases handled (invalid input, missing data)
- [ ] Role-based access control: Beneficiaire ≠ Consultant ≠ Organisme
- [ ] Beneficiaire cannot see other beneficiaires' data
- [ ] Messaging: Unread count accurate, no race conditions
- [ ] Appointments: Timezone handling correct
- [ ] PDF generation: Template renders correctly with special characters
- [ ] Scrolling/pagination works on large datasets (100+ bilans)

#### Performance
- [ ] Dashboard load time < 2 seconds
- [ ] Bilan list (50 items) renders without lag
- [ ] PDF generation completes < 5 seconds
- [ ] API responses p95 < 200ms
- [ ] Database queries optimized (no N+1 queries)

#### Security
- [ ] No console errors/warnings in production
- [ ] Sensitive data not logged (passwords, tokens)
- [ ] HTTPS enforced everywhere
- [ ] JWT tokens not exposed in localStorage (httpOnly cookies only)
- [ ] CORS headers correct
- [ ] SQL injection tests pass
- [ ] XSS tests pass (malicious input in form fields)

#### Accessibility (RGAA)
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader: NVDA reads all content correctly
- [ ] Color contrast: axe DevTools shows 0 violations
- [ ] Focus visible: Clear outline on all focused elements
- [ ] Form labels: All inputs have associated labels
- [ ] Images: Alt text on all non-decorative images

#### Mobile
- [ ] Responsive on iPhone 12, iPad, Android
- [ ] Touch targets: Minimum 44x44 pixels
- [ ] Forms usable on mobile (not tiny)
- [ ] Images don't overflow
- [ ] No horizontal scrolling

#### Data Integrity
- [ ] Deleted bilans: Soft delete (status='archived'), not hard delete
- [ ] Concurrent edits: Last write wins (timestamp based)
- [ ] Evaluation calculations: Verified with manual calculation
- [ ] Audit logs: Complete for critical operations

#### Browser Compatibility
- [ ] Chrome 120+: ✅
- [ ] Firefox 121+: ✅
- [ ] Safari 17+: ✅
- [ ] Edge 120+: ✅

---

## ⚙️ BELGE 7: Environment Setup & Configuration

### 7.1 - .env.example (Frontend & Backend)

```bash
# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Secure backend only

# ===== AUTHENTICATION =====
NEXTAUTH_SECRET=your-very-long-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000  # production: https://bilan.ai

# ===== GOOGLE GEMINI =====
GOOGLE_GEMINI_API_KEY=AIzaSy...  # Keep secure, use Edge Functions
GEMINI_MODEL=gemini-1.5-flash

# ===== STRIPE =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Backend only
STRIPE_WEBHOOK_SECRET=whsec_...

# ===== EMAIL =====
SENDGRID_API_KEY=SG.xxx...
EMAIL_FROM=noreply@bilan.ai

# ===== STORAGE =====
SUPABASE_BUCKET_NAME=bilan-files
SUPABASE_BUCKET_REGION=eu-west-1

# ===== LOGGING & MONITORING =====
SENTRY_DSN=https://xxx@xxx.sentry.io/xxx
ENABLE_DEBUG_LOGS=false  # true in development

# ===== PDF GENERATION =====
PDF_GENERATOR_URL=https://pdf-service.example.com
PDF_TIMEOUT_MS=5000

# ===== FRANCE TRAVAIL API (Future) =====
FRANCE_TRAVAIL_API_KEY=xxx
FRANCE_TRAVAIL_API_URL=https://api.francetravail.io
```

### 7.2 - Local Development Setup

```bash
# 1. Clone repo
git clone https://github.com/netzinformatique/bilan-competence.git
cd bilan-competence

# 2. Install dependencies
npm install

# 3. Create .env.local from .env.example
cp .env.example .env.local
# Edit with local values (Supabase dev project)

# 4. Setup local Supabase (via Docker)
npm run supabase:start
# This spins up local PostgreSQL + Auth

# 5. Run database migrations
npm run supabase:migrations

# 6. Seed test data (optional)
npm run db:seed

# 7. Start dev server
npm run dev
# Open http://localhost:3000

# 8. Run tests
npm run test                    # Unit tests
npm run test:integration       # Integration tests
npm run test:e2e               # E2E tests (Playwright)
```

### 7.3 - Database Migration Script Example

```sql
-- migrations/001_initial_schema.sql
-- Timestamp: 2025-11-07

BEGIN TRANSACTION;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables here (copy from BELGE 4)
CREATE TABLE users (...);
CREATE TABLE organismes (...);
... etc

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
... etc

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
... etc

COMMIT;

-- Rollback script (if needed)
-- DROP TABLE users CASCADE;
```

---

## 🚀 BELGE 8: Deployment & DevOps

### 8.1 - CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Generate coverage report
        run: npm run test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run SNYK security scan
        run: npm run snyk:test
        
  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy preview to Vercel
        run: |
          npm ci
          npm run build
          npx vercel deploy --token=${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        run: |
          npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Health check
        run: |
          curl -f https://bilan.ai/api/health || exit 1
      
      - name: Notify Slack
        if: success()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"✅ BilanCompetence.AI deployed to production"}'
      
      - name: Alert on failure
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"❌ Deployment failed! Check GitHub Actions."}'
```

### 8.2 - Vercel Deployment Config

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role",
    "GOOGLE_GEMINI_API_KEY": "@gemini_api_key",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "STRIPE_SECRET_KEY": "@stripe_secret_key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ],
  "redirects": [
    { "source": "/old-path", "destination": "/new-path", "permanent": true }
  ]
}
```

### 8.3 - Deployment Checklist

```
PRE-DEPLOYMENT:
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review approved by 2+ developers
- [ ] No console errors/warnings
- [ ] Security scan (SNYK) shows 0 critical issues
- [ ] Database migrations tested locally & documented
- [ ] Environment variables set in Vercel dashboard
- [ ] Backup of production database created

DEPLOYMENT:
- [ ] Deploy to staging first (verify everything)
- [ ] Run smoke tests on staging
- [ ] Deploy to production during low-traffic period
- [ ] Monitor error rates (Sentry) for 1 hour
- [ ] Verify key endpoints responding (health check)
- [ ] Check database sync successful
- [ ] No user complaints in first 30 minutes

POST-DEPLOYMENT:
- [ ] Create release notes
- [ ] Notify team on Slack
- [ ] Monitor for issues for 24 hours
- [ ] Rollback plan ready if critical issue
```

### 8.4 - Monitoring & Alerting

```
Tool: Sentry (error tracking)
- Alert on: 5+ errors in 5 minutes
- Slack channel: #production-errors

Tool: LogRocket (session replay)
- Record 10% of sessions
- Replay user sessions with errors

Tool: Vercel Analytics
- Monitor: Core Web Vitals
- Alert: LCP > 2.5s, CLS > 0.1, FID > 100ms

Tool: Supabase Dashboard
- Monitor: Database CPU, connections, queries
- Alert: Query takes > 1 second

Tool: Stripe Webhooks
- Monitor: Failed charges, subscription issues
- Alert to billing@netzinformatique.com
```

---

## 🤖 BELGE 9: Gemini Integration Specifics

### 9.1 - Gemini API Usage Patterns

```typescript
// Prompt for auto-generating competence recommendations
const systemPrompt = `
Tu es un expert en bilans de compétences. Analyse les compétences d'une personne
et propose des orientations professionnelles basées sur:
- Ses compétences maîtrisées (Maitrise level)
- Son appétence pour certains domaines
- Tendances du marché du travail français

Format ta réponse en JSON structuré. Sois concis et actionnable.
`;

// 9.2 - Rate Limiting & Cost Control
const GEMINI_RATE_LIMITS = {
  free_tier: 60,           // requests per minute
  paid_tier: 600,
  max_tokens_per_request: 1000,
  max_daily_cost: 100,     // USD per day max
};

// 9.3 - Error Handling with Fallback
async function generateRecommendations(bilans_id) {
  try {
    const response = await geminiClient.generateContent({
      model: "gemini-1.5-flash",
      systemPrompt,
      userPrompt: generatePrompt(bilan_data),
      maxTokens: 500,
      temperature: 0.7
    });
    
    return response.text;
  } catch (error) {
    if (error.code === 'QUOTA_EXCEEDED') {
      // Fallback: Use cached template recommendations
      return getCachedRecommendations(bilan_data);
    }
    throw error;
  }
}
```

### 9.2 - API Call Budget

```
Estimated monthly Gemini costs:
- Per bilan: 1 API call (synthesize evaluations) = ~100 tokens = $0.0015
- 5,000 bilans/month = $7.50 / month
- Plus: Optional AI recommendations (if enabled) = +$3/month

Total: ~$10/month Gemini cost (well within $100/month budget)
```

---

## 📱 BELGE 10: Frontend Component & State Management

### 10.1 - Component Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── PasswordReset.tsx
│   ├── Bilan/
│   │   ├── BilanList.tsx
│   │   ├── BilanDetail.tsx
│   │   ├── BilanForm.tsx
│   │   └── BilanStatus.tsx
│   ├── Evaluation/
│   │   ├── SelfEvaluation.tsx
│   │   ├── ConsultantEvaluation.tsx
│   │   └── EvaluationSummary.tsx
│   ├── Messages/
│   │   ├── MessageThread.tsx
│   │   ├── MessageInput.tsx
│   │   └── NotificationBadge.tsx
│   └── Common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useBilan.ts
│   ├── useAuth.ts
│   ├── useMessages.ts
│   └── useEvaluation.ts
├── context/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── api.ts
│   └── utils.ts
└── pages/
    ├── index.tsx
    ├── login.tsx
    ├── dashboard.tsx
    └── bilans/[id].tsx
```

### 10.2 - State Management with Zustand

```typescript
// stores/bilanStore.ts
import { create } from 'zustand';

interface BilanStore {
  currentBilan: Bilan | null;
  bilans: Bilan[];
  loading: boolean;
  
  setBilan: (bilan: Bilan) => void;
  setBilans: (bilans: Bilan[]) => void;
  updateBilan: (id: string, updates: Partial<Bilan>) => void;
  setLoading: (loading: boolean) => void;
}

export const useBilanStore = create<BilanStore>((set) => ({
  currentBilan: null,
  bilans: [],
  loading: false,
  
  setBilan: (bilan) => set({ currentBilan: bilan }),
  setBilans: (bilans) => set({ bilans }),
  updateBilan: (id, updates) =>
    set((state) => ({
      bilans: state.bilans.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  setLoading: (loading) => set({ loading }),
}));
```

---

## 📊 ÖZET: Eksik Belgelerin Etkisi

| Belge | Geliştiriciyi Bloke Eder? | Çözüm Süresi |
|-------|---------------------------|--------------|
| Database Schema | ✅ EVET | Developer'ın ek 1-2 gün soruşturma |
| API Specifications | ✅ EVET | Specification without being handed = wasted 3-4 days |
| Security & Compliance | ⚠️ KISMEN | Missed RGPD/RGAA requirements until late in sprint |
| Testing Strategy | ⚠️ KISMEN | What constitutes "done"? Manual testing vs automated |
| Environment Setup | ⚠️ KISMEN | Dev environment takes 1 day to setup without docs |
| DevOps & Deployment | ⚠️ KISMEN | Production deployment becomes chaotic |
| Gemini Integration | ❌ HAYIR | But AI features delay 2-3 weeks without details |

---

## ✅ FINAL RECOMMENDATION

Bu 10 belgeyi şu sırada bir **AI Agent** veya **freelance developer'a** ver:

1. **Cahier des Charges** (stratejik vizyon) - Okuma
2. **Teknik Tasarım & MVP** (User Stories) - Okuma
3. **Database Schema** - Supabase setup başlasın
4. **API Specifications** - Backend development başlasın
5. **Environment Setup** - Local dev setup
6. **Security & Compliance** - Code review checklist
7. **Testing Strategy** - QA planning
8. **Gemini Integration** - AI features
9. **DevOps & Deployment** - Production setup
10. **Frontend Components** - UI development

Bu şekilde, **0 soruyla, 8 hafta içinde production-ready MVP** hazırlayabilir.

---

**Hazırladı:** Claude (AI Assistant)  
**Tarih:** 7 Kasım 2025  
**Durum:** Production-ready checklist
