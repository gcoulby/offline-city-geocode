import type { BucketedIndex, ReverseGeocodeResult } from './types.js';
export declare class OfflineCityGeocoder {
    private readonly index;
    constructor(index: BucketedIndex);
    reverseGeocode(lat: number, lon: number, searchRadius?: number): ReverseGeocodeResult | null;
}
