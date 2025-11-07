/**
 * BilanCompetence.AI - Validation Utilities
 */

import { z } from 'zod'

/**
 * Email validation
 */
export const emailSchema = z.string().email('Email invalide')

/**
 * Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')

/**
 * Phone validation (French format)
 */
export const phoneSchema = z
  .string()
  .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide')

/**
 * SIRET validation (French company ID)
 */
export const siretSchema = z
  .string()
  .length(14, 'Le SIRET doit contenir 14 chiffres')
  .regex(/^\d+$/, 'Le SIRET ne doit contenir que des chiffres')

/**
 * Login credentials schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
})

/**
 * Registration schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  user_type: z.enum(['consultant', 'organisme_admin']),
  organisme_name: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

/**
 * Bilan creation schema
 */
export const createBilanSchema = z.object({
  beneficiaire_email: emailSchema,
  beneficiaire_first_name: z.string().min(2, 'Prénom requis'),
  beneficiaire_last_name: z.string().min(2, 'Nom requis'),
  start_date: z.string().min(1, 'Date de début requise'),
  notes: z.string().optional(),
})

/**
 * Evaluation schema
 */
export const evaluationSchema = z.object({
  bilan_id: z.string().uuid(),
  competence_id: z.string().uuid(),
  self_maitrise_level: z.number().min(1).max(5).optional(),
  self_appetence_level: z.number().min(1).max(5).optional(),
  self_context: z.string().optional(),
  consultant_maitrise_level: z.number().min(1).max(5).optional(),
  consultant_appetence_level: z.number().min(1).max(5).optional(),
  consultant_notes: z.string().optional(),
})

/**
 * Message schema
 */
export const messageSchema = z.object({
  bilan_id: z.string().uuid(),
  receiver_id: z.string().uuid(),
  content: z.string().min(1, 'Message requis').max(1000, 'Message trop long'),
})

/**
 * Appointment schema
 */
export const appointmentSchema = z.object({
  bilan_id: z.string().uuid(),
  scheduled_at: z.string().min(1, 'Date requise'),
  duration_minutes: z.number().min(15).max(480).optional(),
  meeting_type: z.enum(['preliminary', 'investigation', 'conclusion', 'follow_up']).optional(),
})

/**
 * Validate data against schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string>
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path.join('.')] = err.message
        }
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: 'Erreur de validation' } }
  }
}
