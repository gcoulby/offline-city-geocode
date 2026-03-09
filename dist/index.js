import index from '../data/index.json' with { type: 'json' };
import { OfflineCityGeocoder } from './lookup.js';
export { OfflineCityGeocoder } from './lookup.js';
export { buildIndex } from './build.js';
const x = index;
export const geocoder = new OfflineCityGeocoder(x);
