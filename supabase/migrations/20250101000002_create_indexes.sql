-- BilanCompetence.AI Database Indexes
-- Migration: Create indexes for query optimization

-- ===========================
-- USERS TABLE INDEXES
-- ===========================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ===========================
-- ORGANISMES TABLE INDEXES
-- ===========================
CREATE INDEX idx_organismes_admin_id ON organismes(admin_id);
CREATE INDEX idx_organismes_subscription_tier ON organismes(subscription_tier);
CREATE INDEX idx_organismes_is_active ON organismes(is_active);
CREATE INDEX idx_organismes_stripe_customer_id ON organismes(stripe_customer_id);

-- ===========================
-- CONSULTANTS TABLE INDEXES
-- ===========================
CREATE INDEX idx_consultants_user_id ON consultants(user_id);
CREATE INDEX idx_consultants_organisme_id ON consultants(organisme_id);

-- ===========================
-- BENEFICIAIRES TABLE INDEXES
-- ===========================
CREATE INDEX idx_beneficiaires_user_id ON beneficiaires(user_id);
CREATE INDEX idx_beneficiaires_consultant_id ON beneficiaires(consultant_id);

-- ===========================
-- BILANS TABLE INDEXES
-- ===========================
CREATE INDEX idx_bilans_beneficiaire_id ON bilans(beneficiaire_id);
CREATE INDEX idx_bilans_consultant_id ON bilans(consultant_id);
CREATE INDEX idx_bilans_organisme_id ON bilans(organisme_id);
CREATE INDEX idx_bilans_status ON bilans(status);
CREATE INDEX idx_bilans_phase ON bilans(phase);
CREATE INDEX idx_bilans_created_at ON bilans(created_at DESC);
CREATE INDEX idx_bilans_start_date ON bilans(start_date);

-- Composite indexes for common queries
CREATE INDEX idx_bilans_consultant_status ON bilans(consultant_id, status);
CREATE INDEX idx_bilans_organisme_status ON bilans(organisme_id, status);

-- ===========================
-- COMPETENCES TABLE INDEXES
-- ===========================
CREATE INDEX idx_competences_category ON competences(category);
CREATE INDEX idx_competences_is_default ON competences(is_default);
CREATE INDEX idx_competences_rome_code ON competences(rome_code);
CREATE INDEX idx_competences_name ON competences(name);

-- ===========================
-- EVALUATIONS TABLE INDEXES
-- ===========================
CREATE INDEX idx_evaluations_bilan_id ON evaluations(bilan_id);
CREATE INDEX idx_evaluations_competence_id ON evaluations(competence_id);
CREATE INDEX idx_evaluations_self_eval_date ON evaluations(self_eval_date);
CREATE INDEX idx_evaluations_consultant_eval_date ON evaluations(consultant_eval_date);

-- ===========================
-- MESSAGES TABLE INDEXES
-- ===========================
CREATE INDEX idx_messages_bilan_id ON messages(bilan_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Composite index for unread messages
CREATE INDEX idx_messages_receiver_unread ON messages(receiver_id, is_read, created_at DESC);

-- ===========================
-- APPOINTMENTS TABLE INDEXES
-- ===========================
CREATE INDEX idx_appointments_bilan_id ON appointments(bilan_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_proposed_by_id ON appointments(proposed_by_id);

-- ===========================
-- AUDIT_LOGS TABLE INDEXES
-- ===========================
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ===========================
-- DOCUMENTS TABLE INDEXES
-- ===========================
CREATE INDEX idx_documents_bilan_id ON documents(bilan_id);
CREATE INDEX idx_documents_uploaded_by_id ON documents(uploaded_by_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- ===========================
-- AI_ANALYSES TABLE INDEXES
-- ===========================
CREATE INDEX idx_ai_analyses_bilan_id ON ai_analyses(bilan_id);
CREATE INDEX idx_ai_analyses_analysis_type ON ai_analyses(analysis_type);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);
