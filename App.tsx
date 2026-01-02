import { useState, useEffect } from 'react'
import { RefreshCw, Radio } from 'lucide-react'

// ==============================================
// TYPES - Define the shape of our data
// ==============================================

interface TramDeparture {
  id: string
  routeNumber: string
  destination: string
  minutesAway: number
  isRealTime: boolean
}

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
          <button
            onClick={loadDepartures}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

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

      {/* Time */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-800">
          {departure.minutesAway === 0 ? 'Now' : `${departure.minutesAway} min`}
        </p>
      </div>
    </li>
  )
}

export default App
