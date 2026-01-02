# OnTime - Build Roadmap

This is a minimal starter. Here's what to build next, in order.

---

## ✅ Phase 1: Current State (You Are Here)

What's working:
- Basic React + Vite + Tailwind setup
- One page showing mock tram departures
- Refresh button (simulates loading)
- Backend server ready for PTV API

**Test it:**
```bash
npm install
npm run dev
```
Open http://localhost:3000 - you should see mock tram departures.

---

## 🔨 Phase 2: Connect Real PTV API

**Goal:** Replace mock data with real Melbourne tram times.

### Step 2.1: Get PTV API Key

Email `APIKeyRequest@ptv.vic.gov.au`:
```
Subject: PTV Timetable API - request for key

Hi, I'd like API credentials for the PTV Timetable API v3 
for a personal journey planning app.

Thanks,
[Your name]
```

### Step 2.2: Add Keys to .env

```bash
cp .env.example .env
# Edit .env and add your PTV_DEV_ID and PTV_API_KEY
```

### Step 2.3: Update App.tsx to Call Real API

Replace the mock `loadDepartures` function:

```tsx
const loadDepartures = async () => {
  setIsLoading(true)
  
  try {
    // Call our backend (which calls PTV)
    const response = await fetch('/api/ptv/departures/2171') // Stop ID
    const data = await response.json()
    
    // Transform PTV response to our format
    const deps = data.departures.map(dep => ({
      id: dep.id,
      routeNumber: dep.routeId.toString(), // Need to look up route name
      destination: 'Unknown', // Need to add direction lookup
      minutesAway: Math.round((new Date(dep.estimatedDeparture || dep.scheduledDeparture) - new Date()) / 60000),
      isRealTime: !!dep.estimatedDeparture,
    }))
    
    setDepartures(deps)
  } catch (error) {
    console.error('Failed to load departures:', error)
  }
  
  setLastUpdated(new Date())
  setIsLoading(false)
}
```

### Step 2.4: Run with Backend

```bash
npm run dev:all
```

**Ask Cursor:** "Help me connect App.tsx to the real PTV API"

---

## 🔨 Phase 3: Find Nearby Stops

**Goal:** Use browser location to find nearest tram stop.

### What to Add:

1. Add a `useState` for the current stop
2. Add a button "Find nearest stop"
3. Use browser geolocation API
4. Call `/api/ptv/stops/nearby?lat=...&lon=...`
5. Display stop name in the header

**Ask Cursor:** "Add a button to find the nearest tram stop using browser location"

---

## 🔨 Phase 4: Add Appointments

**Goal:** Show a simple appointment and calculate when to leave.

### What to Add:

1. Create a simple `Appointment` type
2. Add a mock appointment (or text input)
3. Calculate: `leaveTime = appointmentTime - travelTime - buffer`
4. Show "Leave in X minutes" countdown

**Ask Cursor:** "Add a mock appointment and show when I need to leave to arrive on time"

---

## 🔨 Phase 5: Save Locations

**Goal:** Save home address and appointment locations.

### What to Add:

1. Add localStorage to save/load locations
2. Create a simple form to add a location
3. Show saved locations list
4. Use saved location as origin for journey

**Ask Cursor:** "Add a way to save locations using localStorage"

---

## 🔨 Phase 6: Google Maps Directions

**Goal:** Get actual travel time between locations.

### What to Add:

1. Get Google Maps API key
2. Create a directions service
3. Calculate transit travel time
4. Show route steps

**Ask Cursor:** "Add Google Maps directions API to calculate travel time"

---

## 🔨 Phase 7: Multiple Pages

**Goal:** Split into tabs like the original design.

### What to Add:

1. Install react-router-dom
2. Create separate pages: Upcoming, Calendar, Places, Settings
3. Add bottom tab navigation

**Ask Cursor:** "Add react-router with tabs for Upcoming, Calendar, Places, Settings"

---

## 🔨 Phase 8: Outlook Calendar

**Goal:** Sync real appointments from Outlook.

### What to Add:

1. Set up Azure AD app
2. Add MSAL authentication
3. Fetch calendar events from Microsoft Graph API
4. Display real appointments

**Ask Cursor:** "Help me integrate Microsoft Outlook calendar"

---

## Testing Each Phase

After each phase, test:

1. **Does it compile?** `npm run dev`
2. **Does it show in browser?** Check http://localhost:3000
3. **Does the feature work?** Click/interact with it
4. **Any console errors?** Open browser DevTools (F12)

---

## Debugging Tips

**If nothing shows:**
- Check browser console for errors (F12)
- Make sure `npm run dev` is running
- Try hard refresh (Ctrl+Shift+R)

**If API fails:**
- Check backend is running: `npm run dev:all`
- Check `.env` has correct keys
- Look at terminal for server errors

**Ask Cursor for help:**
- "I'm getting this error: [paste error]"
- "The tram departures aren't loading, help me debug"
- "Add console.log to see what's happening"

---

## File Reference

```
ontime-react/
├── src/
│   ├── App.tsx        ← Main component (edit this!)
│   ├── main.tsx       ← Entry point (don't need to edit)
│   └── index.css      ← Styles
├── server/
│   └── index.js       ← Backend for PTV API
├── .env               ← Your API keys (create from .env.example)
└── package.json       ← Dependencies
```
