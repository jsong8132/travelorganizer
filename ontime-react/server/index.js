import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// ==============================================
// PTV API CONFIG
// ==============================================

const PTV_BASE_URL = 'https://timetableapi.ptv.vic.gov.au'
const PTV_DEV_ID = process.env.PTV_DEV_ID || ''
const PTV_API_KEY = process.env.PTV_API_KEY || ''

// Generate HMAC signature required by PTV API
function signUrl(path) {
  const hmac = crypto.createHmac('sha1', PTV_API_KEY)
  hmac.update(path)
  return hmac.digest('hex').toUpperCase()
}

// ==============================================
// API ENDPOINTS
// ==============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ptvConfigured: !!(PTV_DEV_ID && PTV_API_KEY),
  })
})

// Get departures from a tram stop
app.get('/api/ptv/departures/:stopId', async (req, res) => {
  const { stopId } = req.params

  // Check if PTV is configured
  if (!PTV_DEV_ID || !PTV_API_KEY) {
    return res.status(500).json({ 
      error: 'PTV API not configured. Add PTV_DEV_ID and PTV_API_KEY to .env' 
    })
  }

  try {
    // Build the signed URL
    const path = `/v3/departures/route_type/1/stop/${stopId}?devid=${PTV_DEV_ID}`
    const signature = signUrl(path)
    const url = `${PTV_BASE_URL}${path}&signature=${signature}`

    // Call PTV API
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`PTV API error: ${response.status}`)
    }

    // Transform the response to a simpler format
    const departures = (data.departures || []).slice(0, 10).map(dep => ({
      id: `${dep.run_ref}-${dep.scheduled_departure_utc}`,
      routeId: dep.route_id,
      scheduledDeparture: dep.scheduled_departure_utc,
      estimatedDeparture: dep.estimated_departure_utc,
      atPlatform: dep.at_platform,
    }))

    res.json({ departures })

  } catch (error) {
    console.error('PTV API error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Find nearby tram stops
app.get('/api/ptv/stops/nearby', async (req, res) => {
  const { lat, lon } = req.query

  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' })
  }

  if (!PTV_DEV_ID || !PTV_API_KEY) {
    return res.status(500).json({ error: 'PTV API not configured' })
  }

  try {
    const path = `/v3/stops/location/${lat},${lon}?route_types=1&max_results=5&devid=${PTV_DEV_ID}`
    const signature = signUrl(path)
    const url = `${PTV_BASE_URL}${path}&signature=${signature}`

    const response = await fetch(url)
    const data = await response.json()

    const stops = (data.stops || []).map(stop => ({
      id: stop.stop_id,
      name: stop.stop_name,
      latitude: stop.stop_latitude,
      longitude: stop.stop_longitude,
    }))

    res.json({ stops })

  } catch (error) {
    console.error('PTV API error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==============================================
// START SERVER
// ==============================================

app.listen(PORT, () => {
  console.log(`\n🚊 OnTime API server running on http://localhost:${PORT}`)
  console.log(`   PTV API configured: ${!!(PTV_DEV_ID && PTV_API_KEY)}`)
  console.log('')
})
