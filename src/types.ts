export type CityRecord = {
  id: number
  name: string
  asciiName: string
  lat: number
  lon: number
  countryCode: string
  country: string | null
  admin1Code: string | null
  region: string | null
  population: number
}

export type BucketedIndex = {
  version: 1
  cellSizeDeg: number
  buckets: Record<string, CityRecord[]>
}

export type ReverseGeocodeResult = {
  city: string
  region: string | null
  country: string | null
  countryCode: string
  latitude: number
  longitude: number
  distanceKm: number
  confidence: 'high' | 'medium' | 'low'
  population: number
}
