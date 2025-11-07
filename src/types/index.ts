/**
 * BilanCompetence.AI - Application Types
 * Main type definitions for the application
 */

import { Database } from './database.types'

// Database table types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Organisme = Database['public']['Tables']['organismes']['Row']
export type OrganismeInsert = Database['public']['Tables']['organismes']['Insert']
export type OrganismeUpdate = Database['public']['Tables']['organismes']['Update']

export type Consultant = Database['public']['Tables']['consultants']['Row']
export type ConsultantInsert = Database['public']['Tables']['consultants']['Insert']
export type ConsultantUpdate = Database['public']['Tables']['consultants']['Update']

export type Beneficiaire = Database['public']['Tables']['beneficiaires']['Row']
export type BeneficiaireInsert = Database['public']['Tables']['beneficiaires']['Insert']
export type BeneficiaireUpdate = Database['public']['Tables']['beneficiaires']['Update']

export type Bilan = Database['public']['Tables']['bilans']['Row']
export type BilanInsert = Database['public']['Tables']['bilans']['Insert']
export type BilanUpdate = Database['public']['Tables']['bilans']['Update']

export type Competence = Database['public']['Tables']['competences']['Row']
export type CompetenceInsert = Database['public']['Tables']['competences']['Insert']
export type CompetenceUpdate = Database['public']['Tables']['competences']['Update']

export type Evaluation = Database['public']['Tables']['evaluations']['Row']
export type EvaluationInsert = Database['public']['Tables']['evaluations']['Insert']
export type EvaluationUpdate = Database['public']['Tables']['evaluations']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

export type Appointment = Database['public']['Tables']['appointments']['Row']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type AIAnalysis = Database['public']['Tables']['ai_analyses']['Row']
export type AIAnalysisInsert = Database['public']['Tables']['ai_analyses']['Insert']
export type AIAnalysisUpdate = Database['public']['Tables']['ai_analyses']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

// Enum types
export type {
  UserType,
  SubscriptionTier,
  BilanStatus,
  BilanPhase,
  CompetenceCategory,
  AppointmentStatus,
  MeetingType,
  DocumentType,
  AnalysisType,
} from './database.types'

// Extended types with relationships
export interface BilanWithRelations extends Bilan {
  beneficiaire?: BeneficiaireWithUser
  consultant?: ConsultantWithUser
  organisme?: Organisme
  evaluations?: EvaluationWithCompetence[]
  messages?: MessageWithUsers[]
  appointments?: AppointmentWithUsers[]
}

export interface BeneficiaireWithUser extends Beneficiaire {
  user?: User
  consultant?: ConsultantWithUser
}

export interface ConsultantWithUser extends Consultant {
  user?: User
  organisme?: Organisme
}

export interface EvaluationWithCompetence extends Evaluation {
  competence?: Competence
}

export interface MessageWithUsers extends Message {
  sender?: User
  receiver?: User
}

export interface AppointmentWithUsers extends Appointment {
  proposed_by?: User
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Authentication types
export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  first_name: string
  last_name: string
  user_type: UserType
  organisme_id?: string
}

// Form types
export interface BilanFormData {
  beneficiaire_email: string
  beneficiaire_first_name: string
  beneficiaire_last_name: string
  start_date: string
  notes?: string
}

export interface EvaluationFormData {
  competence_id: string
  self_maitrise_level: number
  self_appetence_level: number
  self_context?: string
}

export interface ConsultantEvaluationFormData {
  evaluation_id: string
  consultant_maitrise_level: number
  consultant_appetence_level: number
  consultant_notes?: string
}

export interface MessageFormData {
  bilan_id: string
  receiver_id: string
  content: string
}

export interface AppointmentFormData {
  bilan_id: string
  scheduled_at: string
  duration_minutes: number
  meeting_type: MeetingType
}

// AI Integration types
export interface CVExtractionResult {
  hard_skills: string[]
  soft_skills: string[]
  experience_years?: number
  education?: string
}

export interface CareerRecommendation {
  rome_code: string
  metier: string
  pertinence: 'Élevée' | 'Moyenne' | 'Faible'
  description?: string
}

export interface CompetenceAnalysis {
  suggestions_metiers: CareerRecommendation[]
  competences_a_developper: string[]
  resume_analyse: string
}

// PDF Generation types
export interface PDFSynthesisData {
  beneficiaire: BeneficiaireWithUser
  consultant: ConsultantWithUser
  bilan: Bilan
  evaluations: EvaluationWithCompetence[]
  organisme: Organisme
}

// Stripe types
export interface StripeProduct {
  id: string
  price_id: string
  name: string
  monthly_price: number
  bilans_limit: number
  features: string[]
}

// Filter types
export interface BilanFilters {
  status?: BilanStatus
  phase?: BilanPhase
  consultant_id?: string
  beneficiaire_id?: string
  organisme_id?: string
  date_from?: string
  date_to?: string
}

export interface CompetenceFilters {
  category?: CompetenceCategory
  is_default?: boolean
  search?: string
}

// Dashboard types
export interface DashboardStats {
  total_bilans: number
  active_bilans: number
  completed_bilans: number
  total_beneficiaires: number
  unread_messages: number
  upcoming_appointments: number
}

export interface ConsultantDashboardData {
  stats: DashboardStats
  recent_bilans: BilanWithRelations[]
  upcoming_appointments: AppointmentWithUsers[]
  unread_messages: MessageWithUsers[]
}

export interface BeneficiaireDashboardData {
  current_bilan?: BilanWithRelations
  progress_percentage: number
  next_appointment?: AppointmentWithUsers
  unread_messages: MessageWithUsers[]
}

export interface OrganismeDashboardData {
  stats: DashboardStats & {
    total_consultants: number
    subscription_tier: SubscriptionTier
    bilans_limit: number
  }
  recent_bilans: BilanWithRelations[]
  consultants: ConsultantWithUser[]
}

// Notification types
export interface Notification {
  id: string
  type: 'message' | 'appointment' | 'evaluation' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

// Export database type as well
export type { Database }
