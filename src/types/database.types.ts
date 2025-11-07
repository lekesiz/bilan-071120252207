/**
 * BilanCompetence.AI - Database Types
 * Auto-generated TypeScript types for Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'beneficiaire' | 'consultant' | 'organisme_admin'
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'free_limited'
export type BilanStatus = 'draft' | 'in_progress' | 'completed' | 'archived'
export type BilanPhase = 'preliminary' | 'investigation' | 'conclusion'
export type CompetenceCategory = 'Tech' | 'Business' | 'Soft' | 'Language' | 'Other'
export type AppointmentStatus = 'proposed' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
export type MeetingType = 'preliminary' | 'investigation' | 'conclusion' | 'follow_up'
export type DocumentType = 'cv' | 'synthesis' | 'other'
export type AnalysisType = 'cv_extraction' | 'competence_matching' | 'career_recommendation'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          user_type: UserType
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          last_login_at: string | null
          email_verified: boolean
          email_verification_token: string | null
          password_reset_token: string | null
          password_reset_expires: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          user_type: UserType
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          last_login_at?: string | null
          email_verified?: boolean
          email_verification_token?: string | null
          password_reset_token?: string | null
          password_reset_expires?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          user_type?: UserType
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
          last_login_at?: string | null
          email_verified?: boolean
          email_verification_token?: string | null
          password_reset_token?: string | null
          password_reset_expires?: string | null
        }
      }
      organismes: {
        Row: {
          id: string
          name: string
          siret: string | null
          admin_id: string
          subscription_tier: SubscriptionTier
          active_bilans_count: number
          max_bilans: number
          branding_color: string | null
          logo_url: string | null
          is_active: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          siret?: string | null
          admin_id: string
          subscription_tier?: SubscriptionTier
          active_bilans_count?: number
          max_bilans?: number
          branding_color?: string | null
          logo_url?: string | null
          is_active?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          siret?: string | null
          admin_id?: string
          subscription_tier?: SubscriptionTier
          active_bilans_count?: number
          max_bilans?: number
          branding_color?: string | null
          logo_url?: string | null
          is_active?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      consultants: {
        Row: {
          id: string
          user_id: string
          organisme_id: string
          specializations: string[] | null
          certification_qualiopi: boolean
          bio: string | null
          calendar_sync_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organisme_id: string
          specializations?: string[] | null
          certification_qualiopi?: boolean
          bio?: string | null
          calendar_sync_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organisme_id?: string
          specializations?: string[] | null
          certification_qualiopi?: boolean
          bio?: string | null
          calendar_sync_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      beneficiaires: {
        Row: {
          id: string
          user_id: string
          consultant_id: string
          current_job_title: string | null
          current_industry: string | null
          education_level: string | null
          cv_url: string | null
          date_of_birth: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          consultant_id: string
          current_job_title?: string | null
          current_industry?: string | null
          education_level?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          consultant_id?: string
          current_job_title?: string | null
          current_industry?: string | null
          education_level?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bilans: {
        Row: {
          id: string
          beneficiaire_id: string
          consultant_id: string
          organisme_id: string
          status: BilanStatus
          start_date: string
          end_date: string | null
          notes: string | null
          self_eval_completed_at: string | null
          consultant_eval_completed_at: string | null
          synthesis_generated_at: string | null
          synthesis_pdf_url: string | null
          phase: BilanPhase
          total_hours_allocated: number
          hours_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          beneficiaire_id: string
          consultant_id: string
          organisme_id: string
          status?: BilanStatus
          start_date: string
          end_date?: string | null
          notes?: string | null
          self_eval_completed_at?: string | null
          consultant_eval_completed_at?: string | null
          synthesis_generated_at?: string | null
          synthesis_pdf_url?: string | null
          phase?: BilanPhase
          total_hours_allocated?: number
          hours_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          beneficiaire_id?: string
          consultant_id?: string
          organisme_id?: string
          status?: BilanStatus
          start_date?: string
          end_date?: string | null
          notes?: string | null
          self_eval_completed_at?: string | null
          consultant_eval_completed_at?: string | null
          synthesis_generated_at?: string | null
          synthesis_pdf_url?: string | null
          phase?: BilanPhase
          total_hours_allocated?: number
          hours_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      competences: {
        Row: {
          id: string
          name: string
          category: CompetenceCategory | null
          description: string | null
          rome_code: string | null
          is_default: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: CompetenceCategory | null
          description?: string | null
          rome_code?: string | null
          is_default?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: CompetenceCategory | null
          description?: string | null
          rome_code?: string | null
          is_default?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          bilan_id: string
          competence_id: string
          self_maitrise_level: number | null
          self_appetence_level: number | null
          self_context: string | null
          self_eval_date: string | null
          consultant_maitrise_level: number | null
          consultant_appetence_level: number | null
          consultant_notes: string | null
          consultant_eval_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          competence_id: string
          self_maitrise_level?: number | null
          self_appetence_level?: number | null
          self_context?: string | null
          self_eval_date?: string | null
          consultant_maitrise_level?: number | null
          consultant_appetence_level?: number | null
          consultant_notes?: string | null
          consultant_eval_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          competence_id?: string
          self_maitrise_level?: number | null
          self_appetence_level?: number | null
          self_context?: string | null
          self_eval_date?: string | null
          consultant_maitrise_level?: number | null
          consultant_appetence_level?: number | null
          consultant_notes?: string | null
          consultant_eval_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          bilan_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          bilan_id: string
          scheduled_at: string
          duration_minutes: number
          proposed_by_id: string
          status: AppointmentStatus
          rejection_reason: string | null
          meeting_notes: string | null
          meeting_type: MeetingType | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          scheduled_at: string
          duration_minutes?: number
          proposed_by_id: string
          status?: AppointmentStatus
          rejection_reason?: string | null
          meeting_notes?: string | null
          meeting_type?: MeetingType | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          scheduled_at?: string
          duration_minutes?: number
          proposed_by_id?: string
          status?: AppointmentStatus
          rejection_reason?: string | null
          meeting_notes?: string | null
          meeting_type?: MeetingType | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          bilan_id: string
          uploaded_by_id: string
          file_name: string
          file_url: string
          file_type: string | null
          file_size_bytes: number | null
          document_type: DocumentType | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          uploaded_by_id: string
          file_name: string
          file_url: string
          file_type?: string | null
          file_size_bytes?: number | null
          document_type?: DocumentType | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          uploaded_by_id?: string
          file_name?: string
          file_url?: string
          file_type?: string | null
          file_size_bytes?: number | null
          document_type?: DocumentType | null
          created_at?: string
        }
      }
      ai_analyses: {
        Row: {
          id: string
          bilan_id: string
          analysis_type: AnalysisType
          input_data: Json | null
          output_data: Json | null
          gemini_model: string | null
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          analysis_type: AnalysisType
          input_data?: Json | null
          output_data?: Json | null
          gemini_model?: string | null
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          analysis_type?: AnalysisType
          input_data?: Json | null
          output_data?: Json | null
          gemini_model?: string | null
          tokens_used?: number | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
