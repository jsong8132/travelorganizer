import { useState, useEffect } from 'react'
import { RefreshCw, Radio, Settings, Plus, Minus, X } from 'lucide-react'
import { TramDeparture, AppSettings, defaultSettings } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'

// ==============================================
// MOCK DATA - Replace with real API later
// ==============================================

function getMockDepartures(): TramDeparture[] {
  // Simulate tram departures from a stop
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

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    // Cleanup interval on unmount
    return () => clearInterval(timer)
  }, [])

  // Load departures when app starts
  useEffect(() => {
    loadDepartures()
  }, [])

  // Function to load/refresh departures
  const loadDepartures = async () => {
    setIsLoading(true)
    
    // TODO: Replace with real API call
    // const response = await fetch('/api/ptv/departures/12345')
    // const data = await response.json()
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Use mock data for now
    setDepartures(getMockDepartures())
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🚊 OnTime</h1>
          <div className="flex items-center gap-3">
            {/* Current time */}
            <span className="text-lg font-mono font-semibold text-gray-700">
              {currentTime.toLocaleTimeString()}
            </span>
            <button
              onClick={loadDepartures}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full hover:bg-gray-200 ${showSettings ? 'bg-gray-200' : ''}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Use mock data toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-700">Use mock data</span>
              <button
                onClick={() => setSettings({ ...settings, useMockData: !settings.useMockData })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.useMockData ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    settings.useMockData ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Early arrival minutes */}
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-700">Arrive early by</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSettings({ 
                    ...settings, 
                    earlyArrivalMinutes: Math.max(0, settings.earlyArrivalMinutes - 1) 
                  })}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-semibold">
                  {settings.earlyArrivalMinutes} min
                </span>
                <button
                  onClick={() => setSettings({ 
                    ...settings, 
                    earlyArrivalMinutes: settings.earlyArrivalMinutes + 1 
                  })}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stop name - TODO: Make this dynamic */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Collins St / Spencer St</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Departures list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {departures.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {isLoading ? 'Loading...' : 'No departures found'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {departures.map(departure => (
                <TramRow key={departure.id} departure={departure} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Using mock data • Real PTV API coming soon
        </p>

      </div>
    </div>
  )
}

// ==============================================
// TRAM ROW COMPONENT
// ==============================================

function TramRow({ departure }: { departure: TramDeparture }) {
  // Determine color based on minutes away
  const getTimeColor = (minutes: number): string => {
    if (minutes <= 2) return 'text-red-600'
    if (minutes <= 5) return 'text-orange-500'
    return 'text-green-600'
  }

  return (
    <li className="flex items-center p-4 hover:bg-gray-50">
      {/* Route number badge */}
      <span className="w-12 h-8 flex items-center justify-center bg-green-600 text-white font-bold rounded text-sm">
        {departure.routeNumber}
      </span>

      {/* Destination */}
      <div className="flex-1 ml-4">
        <p className="font-medium text-gray-800">{departure.destination}</p>
        {departure.isRealTime && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Radio className="w-3 h-3" /> Live
          </p>
        )}
      </div>

      {/* Time - color coded by urgency */}
      <div className="text-right">
        <p className={`text-lg font-bold ${getTimeColor(departure.minutesAway)}`}>
          {departure.minutesAway === 0 ? 'Now' : `${departure.minutesAway} min`}
        </p>
      </div>
    </li>
  )
}

export default App
