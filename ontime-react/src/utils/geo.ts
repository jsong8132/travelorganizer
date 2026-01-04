// ==============================================
// GEOLOCATION UTILITIES
// ==============================================

import { TramStop } from '../types'

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000 // Earth's radius in meters
  
  const toRad = (deg: number) => (deg * Math.PI) / 180
  
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return R * c
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Find the nearest tram stop to given coordinates
 */
export function findNearestStop(
  userLat: number,
  userLng: number,
  stops: TramStop[]
): { stop: TramStop; distance: number } | null {
  if (stops.length === 0) return null
  
  let nearest: TramStop = stops[0]
  let minDistance = haversineDistance(userLat, userLng, stops[0].latitude, stops[0].longitude)
  
  for (let i = 1; i < stops.length; i++) {
    const distance = haversineDistance(userLat, userLng, stops[i].latitude, stops[i].longitude)
    if (distance < minDistance) {
      minDistance = distance
      nearest = stops[i]
    }
  }
  
  return { stop: nearest, distance: minDistance }
}

/**
 * Sort stops by distance from user
 */
export function sortStopsByDistance(
  userLat: number,
  userLng: number,
  stops: TramStop[]
): Array<{ stop: TramStop; distance: number }> {
  return stops
    .map(stop => ({
      stop,
      distance: haversineDistance(userLat, userLng, stop.latitude, stop.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Get all stops within a given radius
 * @param radiusMeters - Radius in meters (default 500m)
 * @returns Array of stops with distances, sorted by distance
 */
export function getStopsWithinRadius(
  userLat: number,
  userLng: number,
  stops: TramStop[],
  radiusMeters: number = 500
): Array<{ stop: TramStop; distance: number }> {
  return stops
    .map(stop => ({
      stop,
      distance: haversineDistance(userLat, userLng, stop.latitude, stop.longitude),
    }))
    .filter(item => item.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance)
}

