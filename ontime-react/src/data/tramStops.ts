import { TramStop } from '../types'

// ==============================================
// MELBOURNE TRAM STOPS DATA
// ==============================================
// Real coordinates for Melbourne CBD tram stops
// In production, this would come from PTV API

export const melbourneTramStops: TramStop[] = [
  // Spencer Street / Southern Cross area
  {
    id: 1,
    name: 'Spencer St / Collins St',
    latitude: -37.8183,
    longitude: 144.9545,
  },
  {
    id: 2,
    name: 'Spencer St / Bourke St',
    latitude: -37.8163,
    longitude: 144.9543,
  },
  {
    id: 3,
    name: 'Spencer St / La Trobe St',
    latitude: -37.8108,
    longitude: 144.9538,
  },
  
  // Collins Street
  {
    id: 4,
    name: 'Collins St / King St',
    latitude: -37.8177,
    longitude: 144.9565,
  },
  {
    id: 5,
    name: 'Collins St / William St',
    latitude: -37.8170,
    longitude: 144.9595,
  },
  {
    id: 6,
    name: 'Collins St / Queen St',
    latitude: -37.8163,
    longitude: 144.9623,
  },
  {
    id: 7,
    name: 'Collins St / Elizabeth St',
    latitude: -37.8155,
    longitude: 144.9650,
  },
  {
    id: 8,
    name: 'Collins St / Swanston St',
    latitude: -37.8148,
    longitude: 144.9672,
  },
  
  // Bourke Street
  {
    id: 9,
    name: 'Bourke St / Elizabeth St',
    latitude: -37.8133,
    longitude: 144.9630,
  },
  {
    id: 10,
    name: 'Bourke St / Swanston St',
    latitude: -37.8125,
    longitude: 144.9655,
  },
  {
    id: 11,
    name: 'Bourke St / Russell St',
    latitude: -37.8118,
    longitude: 144.9680,
  },
  
  // Flinders Street
  {
    id: 12,
    name: 'Flinders St / Elizabeth St',
    latitude: -37.8175,
    longitude: 144.9660,
  },
  {
    id: 13,
    name: 'Flinders St / Swanston St',
    latitude: -37.8170,
    longitude: 144.9680,
  },
  {
    id: 14,
    name: 'Flinders St Station',
    latitude: -37.8183,
    longitude: 144.9671,
  },
  
  // Swanston Street
  {
    id: 15,
    name: 'Melbourne Central Station',
    latitude: -37.8100,
    longitude: 144.9630,
  },
  {
    id: 16,
    name: 'State Library',
    latitude: -37.8095,
    longitude: 144.9645,
  },
  {
    id: 17,
    name: 'RMIT / La Trobe St',
    latitude: -37.8080,
    longitude: 144.9635,
  },
  
  // St Kilda Road
  {
    id: 18,
    name: 'Arts Centre',
    latitude: -37.8215,
    longitude: 144.9685,
  },
  {
    id: 19,
    name: 'NGV / Southbank',
    latitude: -37.8228,
    longitude: 144.9690,
  },
  
  // Docklands
  {
    id: 20,
    name: 'Docklands / Harbour Esplanade',
    latitude: -37.8145,
    longitude: 144.9430,
  },
]

// Default stop when location is unavailable
export const defaultStop = melbourneTramStops[0]

