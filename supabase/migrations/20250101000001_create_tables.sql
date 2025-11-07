-- BilanCompetence.AI Database Schema
-- Migration: Create core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- USERS TABLE (Authentication)
-- ===========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('beneficiaire', 'consultant', 'organisme_admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP WITH TIME ZONE
);

-- ===========================
-- ORGANISMES TABLE
-- ===========================
CREATE TABLE organismes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  siret VARCHAR(14) UNIQUE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(50) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise', 'free_limited')),
  active_bilans_count INT DEFAULT 0,
  max_bilans INT DEFAULT 10,
  branding_color VARCHAR(7),
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- CONSULTANTS TABLE
-- ===========================
CREATE TABLE consultants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organisme_id UUID NOT NULL REFERENCES organismes(id) ON DELETE CASCADE,
  specializations TEXT[],
  certification_qualiopi BOOLEAN DEFAULT false,
  bio TEXT,
  calendar_sync_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- BENEFICIAIRES TABLE
-- ===========================
CREATE TABLE beneficiaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE RESTRICT,
  current_job_title VARCHAR(255),
  current_industry VARCHAR(255),
  education_level VARCHAR(100),
  cv_url VARCHAR(500),
  date_of_birth DATE,
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- BILANS TABLE (Main Assessment)
-- ===========================
CREATE TABLE bilans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiaire_id UUID NOT NULL REFERENCES beneficiaires(id) ON DELETE CASCADE,
  consultant_id UUID NOT NULL REFERENCES consultants(id) ON DELETE RESTRICT,
  organisme_id UUID NOT NULL REFERENCES organismes(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  self_eval_completed_at TIMESTAMP WITH TIME ZONE,
  consultant_eval_completed_at TIMESTAMP WITH TIME ZONE,
  synthesis_generated_at TIMESTAMP WITH TIME ZONE,
  synthesis_pdf_url VARCHAR(500),
  phase VARCHAR(50) DEFAULT 'preliminary' CHECK (phase IN ('preliminary', 'investigation', 'conclusion')),
  total_hours_allocated DECIMAL(5, 2) DEFAULT 24.00,
  hours_completed DECIMAL(5, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- COMPETENCES TABLE (Reference list)
-- ===========================
CREATE TABLE competences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) CHECK (category IN ('Tech', 'Business', 'Soft', 'Language', 'Other')),
  description TEXT,
  rome_code VARCHAR(10),
  is_default BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, category)
);

-- ===========================
-- EVALUATIONS TABLE (Self + Consultant)
-- ===========================
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  competence_id UUID NOT NULL REFERENCES competences(id) ON DELETE CASCADE,
  -- Self-evaluation
  self_maitrise_level INT CHECK (self_maitrise_level BETWEEN 1 AND 5),
  self_appetence_level INT CHECK (self_appetence_level BETWEEN 1 AND 5),
  self_context TEXT,
  self_eval_date TIMESTAMP WITH TIME ZONE,
  -- Consultant evaluation
  consultant_maitrise_level INT CHECK (consultant_maitrise_level BETWEEN 1 AND 5),
  consultant_appetence_level INT CHECK (consultant_appetence_level BETWEEN 1 AND 5),
  consultant_notes TEXT,
  consultant_eval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bilan_id, competence_id)
);

-- ===========================
-- MESSAGES TABLE (Internal chat)
-- ===========================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- APPOINTMENTS TABLE
-- ===========================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT DEFAULT 60,
  proposed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'proposed' CHECK (status IN ('proposed', 'confirmed', 'rejected', 'completed', 'cancelled')),
  rejection_reason TEXT,
  meeting_notes TEXT,
  meeting_type VARCHAR(50) CHECK (meeting_type IN ('preliminary', 'investigation', 'conclusion', 'follow_up')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- AUDIT_LOGS TABLE (Compliance)
-- ===========================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- DOCUMENTS TABLE (File uploads)
-- ===========================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  uploaded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size_bytes INT,
  document_type VARCHAR(50) CHECK (document_type IN ('cv', 'synthesis', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- AI_ANALYSES TABLE (Gemini results)
-- ===========================
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bilan_id UUID NOT NULL REFERENCES bilans(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('cv_extraction', 'competence_matching', 'career_recommendation')),
  input_data JSONB,
  output_data JSONB,
  gemini_model VARCHAR(50),
  tokens_used INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- TRIGGERS
-- ===========================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organismes_updated_at BEFORE UPDATE ON organismes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultants_updated_at BEFORE UPDATE ON consultants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaires_updated_at BEFORE UPDATE ON beneficiaires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bilans_updated_at BEFORE UPDATE ON bilans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_bilans AFTER INSERT OR UPDATE OR DELETE ON bilans FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_evaluations AFTER INSERT OR UPDATE OR DELETE ON evaluations FOR EACH ROW EXECUTE FUNCTION create_audit_log();
CREATE TRIGGER audit_users AFTER UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION create_audit_log();
