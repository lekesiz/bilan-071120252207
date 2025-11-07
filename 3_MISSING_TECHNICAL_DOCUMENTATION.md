# BilanCompetence.AI - Eksik Teknik Dokümantasyon
## (Cahier des Charges + Teknik Tasarım'a eklenmesi gereken 6 belge)

---

## 📋 ÖZET: Developerı %100 bloke etmeyecek eksiklikler

Mevcut 2 belge şunları kapsıyor:
- ✅ **Cahier des Charges**: Stratejik vizyon (NE, NEDEN)
- ✅ **Teknik Tasarım**: Tech stack, User Stories (NASIL - yüksek seviye)

Fakat eksik olan:
- ❌ **Database Schema**: Tam tablo yapıları, ilişkiler
- ❌ **API Specifications**: Endpoint'ler, request/response örnekleri
- ❌ **Security & Compliance**: RGPD checklist, authentication detayları
- ❌ **Testing Strategy**: Test cases, QA checklist
- ❌ **Environment Setup**: .env variables, local dev ortamı
- ❌ **Deployment & DevOps**: CI/CD pipeline, monitoring
- ❌ **Third-party Integration Details**: Gemini, Stripe, Supabase specifics

---

## 📄 BELGE 3: Database Schema Tasarımı

### 3.1 - E-R Diyagramı ve Tablo Listesi

```sql
-- USERS TABLE (Authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('beneficiaire', 'consultant', 'organisme_admin') NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP
);

-- ORGANISMES TABLE
CREATE TABLE organismes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  siret VARCHAR(14) UNIQUE,
  admin_id UUID NOT NULL REFERENCES users(id),
  subscription_tier ENUM('starter', 'professional', 'enterprise') DEFAULT 'starter',
  active_bilans_count INT DEFAULT 0,
  max_bilans INT DEFAULT 10,
  branding_color VARCHAR(7),
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONSULTANTS TABLE
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  organisme_id UUID NOT NULL REFERENCES organismes(id),
  specializations TEXT[],
  certification_qualiopi BOOLEAN DEFAULT false,
  bio TEXT,
  calendar_sync_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- BENEFICIAIRES TABLE
CREATE TABLE beneficiaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  consultant_id UUID NOT NULL REFERENCES consultants(id),
  current_job_title VARCHAR(255),
  current_industry VARCHAR(255),
  education_level VARCHAR(100),
  cv_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BILANS TABLE (Main Assessment)
CREATE TABLE bilans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiaire_id UUID NOT NULL REFERENCES beneficiaires(id),
  consultant_id UUID NOT NULL REFERENCES consultants(id),
  organisme_id UUID NOT NULL REFERENCES organismes(id),
  status ENUM('draft', 'in_progress', 'completed', 'archived') DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  self_eval_completed_at TIMESTAMP,
  consultant_eval_completed_at TIMESTAMP,
  synthesis_generated_at TIMESTAMP,
  synthesis_pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- COMPETENCES TABLE (Reference list)
CREATE TABLE competences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  is_default BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- EVALUATIONS TABLE (Self + Consultant)
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id),
  competence_id UUID NOT NULL REFERENCES competences(id),
  -- Self-evaluation
  self_maitrise_level INT (1-5),
  self_appetence_level INT (1-5),
  self_eval_date TIMESTAMP,
  -- Consultant evaluation
  consultant_maitrise_level INT (1-5),
  consultant_appetence_level INT (1-5),
  consultant_notes TEXT,
  consultant_eval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(bilan_id, competence_id)
);

-- MESSAGES TABLE (Internal chat)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bilan_id UUID NOT NULL REFERENCES bilans(id),
  scheduled_at TIMESTAMP NOT NULL,
  proposed_by_id UUID NOT NULL REFERENCES users(id),
  status ENUM('proposed', 'confirmed', 'rejected', 'completed') DEFAULT 'proposed',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AUDIT_LOGS TABLE (Compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_consultants_organisme_id ON consultants(organisme_id);
CREATE INDEX idx_bilans_status ON bilans(status);
CREATE INDEX idx_bilans_beneficiaire_id ON bilans(beneficiaire_id);
CREATE INDEX idx_messages_bilan_id ON messages(bilan_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 3.2 - Row Level Security (RLS) Policies

```sql
-- Beneficiaire can only see their own data
ALTER TABLE bilans ENABLE ROW LEVEL SECURITY;
CREATE POLICY beneficiaire_read_own_bilans ON bilans
  FOR SELECT USING (
    beneficiaire_id IN (
      SELECT id FROM beneficiaires 
      WHERE user_id = auth.uid()
    )
  );

-- Consultant can see their assigned bilans
CREATE POLICY consultant_read_assigned_bilans ON bilans
  FOR SELECT USING (
    consultant_id IN (
      SELECT id FROM consultants 
      WHERE user_id = auth.uid()
    )
  );

-- Apply similar policies to messages, evaluations, etc.
```

### 3.3 - Data Relationships Diagram (Mermaid)

```
Users (1) ──── (1) Consultants
  |
  └─── (1) Beneficiaires ──── (N) Bilans
                                    |
                                    ├─── (N) Evaluations
                                    ├─── (N) Messages
                                    └─── (N) Appointments

Organismes (1) ──── (N) Consultants
        |
        └─── (N) Bilans
```

---

## 📡 BELGE 4: API Specifications

### 4.1 - Authentication Endpoints

```
POST /api/auth/register
  Body: { email, password, user_type, organisme_id? }
  Response: { user_id, token, expires_in }
  Status: 201 Created | 400 Bad Request | 409 Conflict

POST /api/auth/login
  Body: { email, password }
  Response: { user_id, token, expires_in, user_type }
  Status: 200 | 401 Unauthorized

POST /api/auth/logout
  Headers: Authorization: Bearer {token}
  Response: { success: true }
  Status: 200

POST /api/auth/refresh-token
  Headers: Authorization: Bearer {token}
  Response: { token, expires_in }
  Status: 200

POST /api/auth/forgot-password
  Body: { email }
  Response: { message: "Reset link sent" }
  Status: 200

POST /api/auth/reset-password
  Body: { token, new_password }
  Response: { success: true }
  Status: 200
```

### 4.2 - Bilan Management Endpoints

```
POST /api/bilans
  Headers: Authorization, Content-Type: application/json
  Body: { beneficiaire_id, start_date }
  Response: { bilan_id, status, created_at }
  Status: 201
  Roles: consultant, organisme_admin

GET /api/bilans
  Headers: Authorization
  Query: ?status=in_progress&limit=10&offset=0
  Response: { bilans: [...], total_count }
  Status: 200
  Roles: consultant (sees own), organisme_admin (sees all)

GET /api/bilans/{bilan_id}
  Headers: Authorization
  Response: { bilan_id, status, beneficiaire, evaluations, messages }
  Status: 200 | 404

PATCH /api/bilans/{bilan_id}
  Headers: Authorization
  Body: { status, notes, end_date? }
  Response: { bilan_id, updated_at }
  Status: 200

DELETE /api/bilans/{bilan_id}
  Headers: Authorization
  Response: { success: true }
  Status: 200
  Roles: organisme_admin only
```

### 4.3 - Evaluation Endpoints

```
POST /api/bilans/{bilan_id}/evaluations/self
  Headers: Authorization
  Body: { 
    competence_id, 
    maitrise_level (1-5), 
    appetence_level (1-5) 
  }
  Response: { evaluation_id, created_at }
  Status: 201
  Roles: beneficiaire (own evaluation)

POST /api/bilans/{bilan_id}/evaluations/consultant
  Headers: Authorization
  Body: { 
    competence_id, 
    maitrise_level (1-5), 
    appetence_level (1-5),
    notes
  }
  Response: { evaluation_id, created_at }
  Status: 201
  Roles: consultant (own bilans)

GET /api/bilans/{bilan_id}/evaluations
  Headers: Authorization
  Response: { evaluations: [...] }
  Status: 200
```

### 4.4 - Messaging Endpoints

```
POST /api/bilans/{bilan_id}/messages
  Headers: Authorization
  Body: { content }
  Response: { message_id, sender_id, created_at }
  Status: 201

GET /api/bilans/{bilan_id}/messages
  Headers: Authorization
  Query: ?limit=50&offset=0
  Response: { messages: [...], unread_count }
  Status: 200

PATCH /api/messages/{message_id}/read
  Headers: Authorization
  Response: { success: true }
  Status: 200
```

### 4.5 - Document Generation Endpoint

```
POST /api/bilans/{bilan_id}/generate-synthesis
  Headers: Authorization
  Body: { format: 'pdf' }
  Response: { pdf_url, generated_at }
  Status: 201
  Queue: Job queued for async processing

GET /api/bilans/{bilan_id}/synthesis
  Headers: Authorization
  Response: { pdf_url, generated_at, status }
  Status: 200 | 404
```

### 4.6 - Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'email' is required",
    "details": {
      "field": "email",
      "type": "required"
    },
    "timestamp": "2025-11-07T10:00:00Z",
    "request_id": "req_abc123"
  }
}
```

---

## 🔒 BELGE 5: Security & Compliance Checklist

### 5.1 - RGPD Compliance

- ✅ **Data Collection**: Sadece gerekli veriler toplanacak (gereklilik ilkesi)
- ✅ **Consent**: Kayıt sırasında açık rıza alınacak
- ✅ **Data Retention**: Silinen bilan verileri 30 gün sonra hard delete
- ✅ **Right to Access**: Kullanıcı `/api/account/export-data` ile tüm verilerini indirebilir
- ✅ **Right to Deletion**: `/api/account/delete` endpoint'i 30 gün grace period ile çalışacak
- ✅ **Data Breach**: Supabase breach notification + user email
- ✅ **DPA (Data Processing Agreement)**: Supabase DPA imzalanmış olacak
- ✅ **Sub-processors**: Stripe, Google Gemini, Vercel DPA'ları imzalanacak

### 5.2 - Authentication Security

```
- ✅ Password: Minimum 12 chars, numbers + uppercase + symbols
- ✅ Hashing: bcrypt with salt (cost 12)
- ✅ JWT Tokens: HS256 signed, 1 hour expiry
- ✅ Refresh Tokens: 7 days expiry, stored in httpOnly cookies
- ✅ Session Timeout: 30 minutes inactivity
- ✅ 2FA: Optional (TOTP via Google Authenticator)
- ✅ Rate Limiting: 5 failed login attempts = 15 min lockout
```

### 5.3 - API Security

```
- ✅ HTTPS Only: All endpoints require TLS 1.3+
- ✅ CORS: Whitelist specific domains only
- ✅ Rate Limiting: 100 requests/minute per IP
- ✅ Request Validation: Strict schema validation (Zod/Joi)
- ✅ SQL Injection: Parameterized queries (Supabase handles)
- ✅ XSS Protection: Content-Type headers, DOMPurify
- ✅ CSRF Protection: SameSite=Strict cookies
```

### 5.4 - Data Encryption

```
- ✅ In Transit: TLS 1.3 (Vercel + Supabase)
- ✅ At Rest: Supabase encryption (AES-256)
- ✅ Sensitive Fields: CV, synthesis PDFs encrypted
- ✅ API Keys: Supabase Edge Functions (no keys in code)
```

### 5.5 - Audit & Logging

```
- ✅ Action Logging: Toutes les modifications audit_logs table'a kaydedilecek
- ✅ Admin Audit Trail: Organisme admin'in tüm hareketleri log'a yazılacak
- ✅ Sensitive Operations: Bilan deletion, role changes, exports logged
- ✅ Retention: 1 yıl log saklama
```

### 5.6 - RGAA Accessibility (AA Level)

- ✅ WCAG 2.1 AA compliance
- ✅ Contrast ratio: minimum 4.5:1 for text
- ✅ Keyboard navigation: Tab, Enter, Escape keys working
- ✅ Screen reader: aria-labels, role attributes
- ✅ Form labels: <label> properly associated with inputs
- ✅ Color not only differentiator: Icons + text for actions
- ✅ Focus visible: Clear focus outlines
- ✅ Testing: axe DevTools + NVDA screen reader monthly

---

## ✅ BELGE 6: Testing Strategy & QA Checklist

### 6.1 - Test Coverage Targets

```
Unit Tests: 80% coverage (critical business logic)
- Authentication flows
- Role-based access control (RLS)
- Evaluation scoring logic
- PDF generation

Integration Tests: 70% coverage
- API endpoints (happy path + error cases)
- Database operations with RLS
- Third-party API mocking (Gemini, Stripe)

E2E Tests: 40% coverage
- Critical user journeys:
  1. Consultant creates bilan → Beneficiaire completes eval → PDF generated
  2. Messaging between consultant & beneficiaire
  3. Appointment proposal & confirmation
  4. Payment flow (if paid features)

Performance Tests:
- API response time < 200ms (p95)
- Database queries < 100ms
- PDF generation < 5 seconds
```

### 6.2 - Test Case Examples

#### US-1