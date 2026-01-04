import { useState, useCallback } from 'react'

// ==============================================
// GEOLOCATION HOOK
// ==============================================

export interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  isLoading: boolean
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  error: null,
  isLoading: false,
}

/**
 * Custom hook for browser geolocation
 * Uses the free Browser Geolocation API
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState)

  const getLocation = useCallback(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      }))
      return
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
        })
      },
      // Error callback
      (error) => {
        let errorMessage: string
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
        }
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }))
      },
      // Options - lower accuracy for faster response
      {
        enableHighAccuracy: false,
        timeout: 30000, // 30 seconds timeout
        maximumAge: 300000, // Cache for 5 minutes
      }
    )
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    getLocation,
    clearError,
    hasLocation: state.latitude !== null && state.longitude !== null,
  }
}

