import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import { X, MapPin } from 'lucide-react'
import { config } from '../config'

// ==============================================
// MAP POPUP COMPONENT
// ==============================================

interface MapPopupProps {
  userLat: number
  userLng: number
  onClose: () => void
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '12px',
}

// Map options for clean look
const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

export function MapPopup({ userLat, userLng, onClose }: MapPopupProps) {
  // Load Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.googleMapsApiKey,
  })

  // Map center
  const center = {
    lat: userLat,
    lng: userLng,
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 text-stone-600">
            <div className="w-5 h-5 border-2 border-stone-300 border-t-orange-500 rounded-full animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
          <div className="text-center">
            <p className="text-rose-600 mb-4">Failed to load map</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-800">Your Location</h3>
              <p className="text-xs text-stone-500">
                {userLat.toFixed(5)}, {userLng.toFixed(5)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Map */}
        <div className="p-4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            options={mapOptions}
          >
            {/* User location marker */}
            <MarkerF
              position={center}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 3,
              }}
              title="Your location"
            />
          </GoogleMap>
        </div>
      </div>
    </div>
  )
}
