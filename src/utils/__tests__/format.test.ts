/**
 * BilanCompetence.AI - Format Utils Tests
 */

import {
  formatDate,
  formatCurrency,
  truncate,
  getInitials,
  calculateProgress,
} from '../format'

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('should format date to French locale', () => {
      const date = '2025-01-15T10:00:00Z'
      const result = formatDate(date)
      expect(result).toContain('janvier')
      expect(result).toContain('2025')
    })

    it('should return empty string for invalid date', () => {
      expect(formatDate('')).toBe('')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in Euros', () => {
      expect(formatCurrency(49)).toBe('49,00 €')
      expect(formatCurrency(149)).toBe('149,00 €')
    })

    it('should handle decimal values', () => {
      expect(formatCurrency(49.99)).toBe('49,99 €')
    })
  })

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated'
      expect(truncate(text, 20)).toBe('This is a very long ...')
    })

    it('should not truncate short text', () => {
      const text = 'Short text'
      expect(truncate(text, 20)).toBe('Short text')
    })
  })

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('Jean', 'Dupont')).toBe('JD')
    })

    it('should handle missing names', () => {
      expect(getInitials('Jean', '')).toBe('J')
      expect(getInitials('', 'Dupont')).toBe('D')
      expect(getInitials('', '')).toBe('?')
    })
  })

  describe('calculateProgress', () => {
    it('should calculate progress percentage', () => {
      expect(calculateProgress(5, 10)).toBe(50)
      expect(calculateProgress(7, 10)).toBe(70)
      expect(calculateProgress(10, 10)).toBe(100)
    })

    it('should handle edge cases', () => {
      expect(calculateProgress(0, 10)).toBe(0)
      expect(calculateProgress(10, 0)).toBe(0)
    })
  })
})
