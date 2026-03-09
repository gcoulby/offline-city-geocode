export { OfflineCityGeocoder } from './lookup.js'
export { buildIndex } from './build.js'
export type { BucketedIndex, CityRecord, ReverseGeocodeResult } from './types.js'

import fs from 'node:fs'
import zlib from 'node:zlib'

const raw = fs.readFileSync(new URL('../data/index.zip', import.meta.url))
const index = JSON.parse(zlib.gunzipSync(raw).toString())

import { OfflineCityGeocoder } from './lookup.js'

export const geocoder = new OfflineCityGeocoder(index)
