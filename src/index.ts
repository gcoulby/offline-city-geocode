import index from '../data/index.json' with { type: 'json' }

import { OfflineCityGeocoder } from './lookup.js'
import type { BucketedIndex, CityRecord, ReverseGeocodeResult } from './types.js'

export { OfflineCityGeocoder } from './lookup.js'
export { buildIndex } from './build.js'
export type { BucketedIndex, CityRecord, ReverseGeocodeResult } from './types.js'

const x = index as BucketedIndex

export const geocoder = new OfflineCityGeocoder(x)
