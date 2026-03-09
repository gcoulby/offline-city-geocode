export { OfflineCityGeocoder } from './lookup.js'
export { buildIndex } from './build.js'
export type { BucketedIndex, CityRecord, ReverseGeocodeResult } from './types.js'

import index from '../data/index.json' with { type: 'json' }
import { BucketedIndex } from './types.js'
import { OfflineCityGeocoder } from './lookup.js'

const x = index as BucketedIndex
export const geocoder = new OfflineCityGeocoder(x)
