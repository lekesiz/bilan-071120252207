-- BilanCompetence.AI Row Level Security Policies
-- Migration: Enable RLS and create security policies

-- ===========================
-- ENABLE RLS ON ALL TABLES
-- ===========================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organismes ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE bilans ENABLE ROW LEVEL SECURITY;
ALTER TABLE competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ===========================
-- USERS TABLE POLICIES
-- ===========================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admin users can view all users in their organization
CREATE POLICY "Admins can view org users"
  ON users FOR SELECT
  USING (
    user_type = 'organisme_admin' AND
    id IN (
      SELECT c.user_id FROM consultants c
      WHERE c.organisme_id IN (
        SELECT o.id FROM organismes o WHERE o.admin_id = auth.uid()
      )
    )
  );

-- ===========================
-- ORGANISMES TABLE POLICIES
-- ===========================

-- Organisme admins can view their own organisme
CREATE POLICY "Admins can view own organisme"
  ON organismes FOR SELECT
  USING (admin_id = auth.uid());

-- Organisme admins can update their own organisme
CREATE POLICY "Admins can update own organisme"
  ON organismes FOR UPDATE
  USING (admin_id = auth.uid());

-- Consultants can view their organisme
CREATE POLICY "Consultants can view their organisme"
  ON organismes FOR SELECT
  USING (
    id IN (
      SELECT organisme_id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- ===========================
-- CONSULTANTS TABLE POLICIES
-- ===========================

-- Consultants can view their own profile
CREATE POLICY "Consultants can view own profile"
  ON consultants FOR SELECT
  USING (user_id = auth.uid());

-- Consultants can update their own profile
CREATE POLICY "Consultants can update own profile"
  ON consultants FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can view consultants in their organisme
CREATE POLICY "Admins can view org consultants"
  ON consultants FOR SELECT
  USING (
    organisme_id IN (
      SELECT id FROM organismes WHERE admin_id = auth.uid()
    )
  );

-- Admins can create consultants in their organisme
CREATE POLICY "Admins can create org consultants"
  ON consultants FOR INSERT
  WITH CHECK (
    organisme_id IN (
      SELECT id FROM organismes WHERE admin_id = auth.uid()
    )
  );

-- ===========================
-- BENEFICIAIRES TABLE POLICIES
-- ===========================

-- Beneficiaires can view their own profile
CREATE POLICY "Beneficiaires can view own profile"
  ON beneficiaires FOR SELECT
  USING (user_id = auth.uid());

-- Beneficiaires can update their own profile
CREATE POLICY "Beneficiaires can update own profile"
  ON beneficiaires FOR UPDATE
  USING (user_id = auth.uid());

-- Consultants can view their assigned beneficiaires
CREATE POLICY "Consultants can view assigned beneficiaires"
  ON beneficiaires FOR SELECT
  USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can create beneficiaires
CREATE POLICY "Consultants can create beneficiaires"
  ON beneficiaires FOR INSERT
  WITH CHECK (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- ===========================
-- BILANS TABLE POLICIES
-- ===========================

-- Beneficiaires can view their own bilans
CREATE POLICY "Beneficiaires can view own bilans"
  ON bilans FOR SELECT
  USING (
    beneficiaire_id IN (
      SELECT id FROM beneficiaires WHERE user_id = auth.uid()
    )
  );

-- Consultants can view their assigned bilans
CREATE POLICY "Consultants can view assigned bilans"
  ON bilans FOR SELECT
  USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can create bilans for their beneficiaires
CREATE POLICY "Consultants can create bilans"
  ON bilans FOR INSERT
  WITH CHECK (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Consultants can update their assigned bilans
CREATE POLICY "Consultants can update assigned bilans"
  ON bilans FOR UPDATE
  USING (
    consultant_id IN (
      SELECT id FROM consultants WHERE user_id = auth.uid()
    )
  );

-- Admins can view all bilans in their organisme
CREATE POLICY "Admins can view org bilans"
  ON bilans FOR SELECT
  USING (
    organisme_id IN (
      SELECT id FROM organismes WHERE admin_id = auth.uid()
    )
  );

-- ===========================
-- COMPETENCES TABLE POLICIES
-- ===========================

-- Everyone can view default competences
CREATE POLICY "Everyone can view default competences"
  ON competences FOR SELECT
  USING (is_default = true);

-- Consultants can create custom competences
CREATE POLICY "Consultants can create competences"
  ON competences FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    created_by IN (SELECT user_id FROM consultants)
  );

-- ===========================
-- EVALUATIONS TABLE POLICIES
-- ===========================

-- Beneficiaires can view evaluations for their bilans
CREATE POLICY "Beneficiaires can view own evaluations"
  ON evaluations FOR SELECT
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      WHERE ben.user_id = auth.uid()
    )
  );

-- Beneficiaires can create/update their self-evaluations
CREATE POLICY "Beneficiaires can create self evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      WHERE ben.user_id = auth.uid()
    )
  );

CREATE POLICY "Beneficiaires can update self evaluations"
  ON evaluations FOR UPDATE
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      WHERE ben.user_id = auth.uid()
    )
  );

-- Consultants can view and update evaluations for their bilans
CREATE POLICY "Consultants can view bilan evaluations"
  ON evaluations FOR SELECT
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN consultants c ON b.consultant_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can update evaluations"
  ON evaluations FOR UPDATE
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN consultants c ON b.consultant_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- ===========================
-- MESSAGES TABLE POLICIES
-- ===========================

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

-- Users can send messages in their bilans
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    bilan_id IN (
      SELECT b.id FROM bilans b
      LEFT JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      LEFT JOIN consultants c ON b.consultant_id = c.id
      WHERE ben.user_id = auth.uid() OR c.user_id = auth.uid()
    )
  );

-- Users can mark their received messages as read
CREATE POLICY "Users can mark messages as read"
  ON messages FOR UPDATE
  USING (receiver_id = auth.uid());

-- ===========================
-- APPOINTMENTS TABLE POLICIES
-- ===========================

-- Users can view appointments for their bilans
CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      LEFT JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      LEFT JOIN consultants c ON b.consultant_id = c.id
      WHERE ben.user_id = auth.uid() OR c.user_id = auth.uid()
    )
  );

-- Consultants can create appointments
CREATE POLICY "Consultants can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    proposed_by_id = auth.uid() AND
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN consultants c ON b.consultant_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Users can update appointments for their bilans
CREATE POLICY "Users can update appointments"
  ON appointments FOR UPDATE
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      LEFT JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      LEFT JOIN consultants c ON b.consultant_id = c.id
      WHERE ben.user_id = auth.uid() OR c.user_id = auth.uid()
    )
  );

-- ===========================
-- DOCUMENTS TABLE POLICIES
-- ===========================

-- Users can view documents for their bilans
CREATE POLICY "Users can view their documents"
  ON documents FOR SELECT
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      LEFT JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      LEFT JOIN consultants c ON b.consultant_id = c.id
      WHERE ben.user_id = auth.uid() OR c.user_id = auth.uid()
    )
  );

-- Users can upload documents to their bilans
CREATE POLICY "Users can upload documents"
  ON documents FOR INSERT
  WITH CHECK (
    uploaded_by_id = auth.uid() AND
    bilan_id IN (
      SELECT b.id FROM bilans b
      LEFT JOIN beneficiaires ben ON b.beneficiaire_id = ben.id
      LEFT JOIN consultants c ON b.consultant_id = c.id
      WHERE ben.user_id = auth.uid() OR c.user_id = auth.uid()
    )
  );

-- ===========================
-- AI_ANALYSES TABLE POLICIES
-- ===========================

-- Consultants can view AI analyses for their bilans
CREATE POLICY "Consultants can view AI analyses"
  ON ai_analyses FOR SELECT
  USING (
    bilan_id IN (
      SELECT b.id FROM bilans b
      JOIN consultants c ON b.consultant_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- System can create AI analyses (service role)
CREATE POLICY "System can create AI analyses"
  ON ai_analyses FOR INSERT
  WITH CHECK (true);

-- ===========================
-- AUDIT_LOGS TABLE POLICIES
-- ===========================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users WHERE user_type = 'organisme_admin'
    )
  );

-- System can create audit logs (via trigger)
CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
