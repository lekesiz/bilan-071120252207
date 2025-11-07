/**
 * BilanCompetence.AI - Card Component
 */

import React from 'react'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export function Card({
  children,
  className,
  hoverable = false,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-card shadow-card',
        {
          'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer':
            hoverable,
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-secondary">{title}</h3>
        {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
}

export function CardContent({ children }: CardContentProps) {
  return <div>{children}</div>
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  )
}
