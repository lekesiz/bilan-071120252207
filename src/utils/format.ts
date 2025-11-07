/**
 * BilanCompetence.AI - Formatting Utilities
 */

/**
 * Format date to French locale
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get relative time (e.g., "il y a 2 heures")
 */
export function getRelativeTime(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'À l\'instant'
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`

  return formatDate(dateStr, { day: '2-digit', month: 'short' })
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as French phone number: 06 12 34 56 78
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }

  return phone
}

/**
 * Format currency (Euro)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get initials from full name
 */
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return '?'

  const first = firstName?.charAt(0).toUpperCase() || ''
  const last = lastName?.charAt(0).toUpperCase() || ''

  return `${first}${last}`
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
