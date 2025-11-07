/**
 * BilanCompetence.AI - Badge Component
 */

import React from 'react'
import clsx from 'clsx'
import type { BilanStatus, BilanPhase, AppointmentStatus } from '@/types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-blue-100 text-blue-800': variant === 'info',
        }
      )}
    >
      {children}
    </span>
  )
}

interface BilanStatusBadgeProps {
  status: BilanStatus
}

export function BilanStatusBadge({ status }: BilanStatusBadgeProps) {
  const variants: Record<BilanStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
    draft: { label: 'Brouillon', variant: 'default' },
    in_progress: { label: 'En cours', variant: 'info' },
    completed: { label: 'Terminé', variant: 'success' },
    archived: { label: 'Archivé', variant: 'default' },
  }

  const config = variants[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

interface BilanPhaseBadgeProps {
  phase: BilanPhase
}

export function BilanPhaseBadge({ phase }: BilanPhaseBadgeProps) {
  const phases: Record<BilanPhase, string> = {
    preliminary: 'Phase préliminaire',
    investigation: 'Phase d\'investigation',
    conclusion: 'Phase de conclusion',
  }

  return <Badge variant="info">{phases[phase]}</Badge>
}

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const variants: Record<AppointmentStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
    proposed: { label: 'Proposé', variant: 'warning' },
    confirmed: { label: 'Confirmé', variant: 'success' },
    rejected: { label: 'Refusé', variant: 'danger' },
    completed: { label: 'Terminé', variant: 'default' },
    cancelled: { label: 'Annulé', variant: 'default' },
  }

  const config = variants[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
