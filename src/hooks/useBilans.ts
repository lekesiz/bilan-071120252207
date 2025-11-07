/**
 * BilanCompetence.AI - useBilans Hook
 * Bilans data fetching and management
 */

'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import type { Bilan, BilanFilters } from '@/types'

export function useBilans(filters?: BilanFilters) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { bilans, setBilans, addBilan, updateBilan } = useStore()

  useEffect(() => {
    fetchBilans()
  }, [filters])

  const fetchBilans = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.consultant_id) params.append('consultant_id', filters.consultant_id)

      const response = await fetch(`/api/bilans?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch bilans')
      }

      setBilans(result.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createBilan = async (data: {
    beneficiaire_email: string
    beneficiaire_first_name: string
    beneficiaire_last_name: string
    start_date: string
    notes?: string
  }) => {
    try {
      const response = await fetch('/api/bilans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create bilan')
      }

      addBilan(result.data)
      return result.data
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const updateBilanStatus = async (bilanId: string, updates: Partial<Bilan>) => {
    try {
      const response = await fetch(`/api/bilans/${bilanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update bilan')
      }

      updateBilan(bilanId, result.data)
      return result.data
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  return {
    bilans,
    loading,
    error,
    fetchBilans,
    createBilan,
    updateBilanStatus,
  }
}
