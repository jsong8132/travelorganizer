import { useState, useEffect } from 'react'
import { RefreshCw, Radio, Settings, Plus, Minus, X, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { TramDeparture, TramStop, AppSettings, defaultSettings } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useGeolocation } from './hooks/useGeolocation'
import { melbourneTramStops, defaultStop } from './data/tramStops'
import { findNearestStop, formatDistance } from './utils/geo'
import { MapPopup } from './components/MapPopup'

// ==============================================
// MOCK DATA - Replace with real API later
// ==============================================

function getMockDepartures(): TramDeparture[] {
  return [
    { id: '1', routeNumber: '96', destination: 'East Brunswick', minutesAway: 2, isRealTime: true },
    { id: '2', routeNumber: '11', destination: 'West Preston', minutesAway: 5, isRealTime: true },
    { id: '3', routeNumber: '86', destination: 'Bundoora RMIT', minutesAway: 8, isRealTime: false },
    { id: '4', routeNumber: '96', destination: 'St Kilda Beach', minutesAway: 12, isRealTime: true },
    { id: '5', routeNumber: '11', destination: 'Victoria Harbour', minutesAway: 15, isRealTime: false },
  ]
}

// ==============================================
// MAIN APP COMPONENT
// ==============================================

function App() {
  const [departures, setDepartures] = useState<TramDeparture[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useLocalStorage<AppSettings>('ontime-settings', defaultSettings)
  
  // Location state
  const geolocation = useGeolocation()
  const [currentStop, setCurrentStop] = useState<TramStop>(defaultStop)
  const [stopDistance, setStopDistance] = useState<number | null>(null)
  const [showMap, setShowMap] = useState(false)

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load departures on mount
  useEffect(() => {
    loadDepartures()
  }, [])

  // Update nearest stop when location changes
  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      const nearest = findNearestStop(
        geolocation.latitude,
        geolocation.longitude,
        melbourneTramStops
      )
      if (nearest) {
        setCurrentStop(nearest.stop)
        setStopDistance(nearest.distance)
      }
    }
  }, [geolocation.latitude, geolocation.longitude])

  const loadDepartures = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setDepartures(getMockDepartures())
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  // Handle map toggle - get location first if not available
  const handleMapToggle = () => {
    if (!geolocation.hasLocation) {
      geolocation.getLocation()
    }
    setShowMap(!showMap)
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center">
                <span className="text-xl">🚊</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-stone-800">OnTime</h1>
                <p className="text-xs text-stone-500">Melbourne Trams</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Clock */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-sm font-medium text-sky-700 tabular-nums">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Action buttons */}
              <button
                onClick={loadDepartures}
                disabled={isLoading}
                className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-50 transition-all focus-ring"
              >
                <RefreshCw className={`w-4 h-4 text-stone-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg border transition-all focus-ring ${
                  showSettings 
                    ? 'bg-orange-50 border-orange-200 text-orange-600' 
                    : 'border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-600'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl p-4 shadow-sm animate-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-stone-800">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-md hover:bg-stone-100 transition-colors focus-ring"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Mock data toggle */}
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <div>
                <span className="text-sm font-medium text-stone-700">Use mock data</span>
                <p className="text-xs text-stone-400">For testing without API</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, useMockData: !settings.useMockData })}
                className={`relative w-11 h-6 rounded-full transition-colors focus-ring ${
                  settings.useMockData 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400' 
                    : 'bg-stone-200'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    settings.useMockData ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Early arrival */}
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-sm font-medium text-stone-700">Arrive early by</span>
                <p className="text-xs text-stone-400">Buffer time for travel</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSettings({ 
                    ...settings, 
                    earlyArrivalMinutes: Math.max(0, settings.earlyArrivalMinutes - 1) 
                  })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all focus-ring"
                >
                  <Minus className="w-3.5 h-3.5 text-stone-600" />
                </button>
                <span className="w-14 text-center text-sm font-semibold text-stone-800 tabular-nums">
                  {settings.earlyArrivalMinutes} min
                </span>
                <button
                  onClick={() => setSettings({ 
                    ...settings, 
                    earlyArrivalMinutes: settings.earlyArrivalMinutes + 1 
                  })}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all focus-ring"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stop Info Card with Location */}
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Map toggle button - click the location icon to open map */}
            <button
              onClick={handleMapToggle}
              disabled={geolocation.isLoading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all focus-ring ${
                showMap || geolocation.hasLocation
                  ? 'bg-gradient-to-br from-sky-400 to-blue-500 shadow-sm'
                  : 'bg-gradient-to-br from-pink-100 to-sky-100 hover:from-pink-200 hover:to-sky-200'
              }`}
              title="Show map"
            >
              {geolocation.isLoading ? (
                <Loader2 className={`w-5 h-5 animate-spin ${showMap || geolocation.hasLocation ? 'text-white' : 'text-pink-400'}`} />
              ) : (
                <MapPin className={`w-5 h-5 ${showMap || geolocation.hasLocation ? 'text-white' : 'text-pink-400'}`} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-medium text-stone-800 truncate">{currentStop.name}</h2>
              <div className="flex items-center gap-2">
                {stopDistance !== null && (
                  <span className="text-xs text-sky-600 font-medium">
                    {formatDistance(stopDistance)} away
                  </span>
                )}
                {lastUpdated && (
                  <span className="text-xs text-stone-400">
                    • Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Location error message */}
          {geolocation.error && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-xs text-rose-600">{geolocation.error}</p>
              <button
                onClick={geolocation.clearError}
                className="ml-auto p-0.5 rounded hover:bg-rose-100"
              >
                <X className="w-3 h-3 text-rose-400" />
              </button>
            </div>
          )}
        </div>

        {/* Departures Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          {departures.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center">
                <RefreshCw className={`w-5 h-5 text-stone-400 ${isLoading ? 'animate-spin' : ''}`} />
              </div>
              <p className="text-sm text-stone-500">
                {isLoading ? 'Loading departures...' : 'No departures found'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {departures.map(departure => (
                <TramRow key={departure.id} departure={departure} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 py-2">
          {settings.useMockData ? 'Using mock data' : 'Connected to PTV API'} • v0.1.0
        </p>

      </div>

      {/* Map Popup */}
      {showMap && geolocation.hasLocation && geolocation.latitude && geolocation.longitude && (
        <MapPopup
          userLat={geolocation.latitude}
          userLng={geolocation.longitude}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  )
}

// ==============================================
// TRAM ROW COMPONENT
// ==============================================

function TramRow({ departure }: { departure: TramDeparture }) {
  // Softer, more muted urgency colors
  const getTimeStyles = (minutes: number) => {
    if (minutes <= 2) return {
      text: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    }
    if (minutes <= 5) return {
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    }
    return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    }
  }

  const timeStyles = getTimeStyles(departure.minutesAway)

  // Route color based on route number (for visual variety)
  const getRouteColor = (route: string) => {
    const colors = [
      'from-orange-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-sky-400 to-blue-500',
      'from-violet-400 to-purple-500',
      'from-teal-400 to-cyan-500',
    ]
    const index = parseInt(route) % colors.length
    return colors[index]
  }

  return (
    <li className="flex items-center gap-4 p-4 hover:bg-stone-50/50 transition-colors">
      {/* Route badge */}
      <div className={`w-12 h-10 flex items-center justify-center bg-gradient-to-br ${getRouteColor(departure.routeNumber)} text-white font-bold rounded-xl text-sm shadow-sm`}>
        {departure.routeNumber}
      </div>

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-800 truncate">{departure.destination}</p>
        {departure.isRealTime && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-600 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Time pill */}
      <div className={`px-3 py-1.5 rounded-lg border ${timeStyles.bg} ${timeStyles.border}`}>
        <p className={`text-sm font-semibold ${timeStyles.text} tabular-nums`}>
          {departure.minutesAway === 0 ? 'Now' : `${departure.minutesAway} min`}
        </p>
      </div>
    </li>
  )
}

export default App
