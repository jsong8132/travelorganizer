// ==============================================
// APP CONFIGURATION
// ==============================================

export const config = {
  // Google Maps API key (for future routing/maps)
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  
  // App settings
  appName: 'OnTime',
  appVersion: '0.1.0',
}

// Check if Google Maps is configured
export const isGoogleMapsConfigured = () => Boolean(config.googleMapsApiKey)

