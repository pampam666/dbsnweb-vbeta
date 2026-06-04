'use client'

import { useCallback } from 'react'
import { event, AnalyticsEvent } from '@/lib/analytics/gtag'

/**
 * Hook to track analytics events with SSR safety checks.
 * Returns a memoized trackEvent function.
 */
export function useTrackEvent() {
  return useCallback((action: AnalyticsEvent, params: Record<string, string | number>) => {
    try {
      event(action, params)
    } catch (error) {
      console.error('Failed to track event inside hook:', error)
    }
  }, [])
}
