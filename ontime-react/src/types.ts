// ==============================================
// TYPES - Define the shape of our data
// ==============================================

export interface TramDeparture {
  id: string
  routeNumber: string
  destination: string
  minutesAway: number
  isRealTime: boolean
}

export interface TramStop {
  id: number
  name: string
  latitude: number
  longitude: number
}

export interface AppSettings {
  earlyArrivalMinutes: number
  useMockData: boolean
}

// Default settings
export const defaultSettings: AppSettings = {
  earlyArrivalMinutes: 5,
  useMockData: true,
}

