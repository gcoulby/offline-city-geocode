import { neighbouringBucketKeys } from './grid.js';
import { haversineKm } from './haversine.js';
function confidenceFromDistance(distanceKm) {
    if (distanceKm <= 25)
        return 'high';
    if (distanceKm <= 100)
        return 'medium';
    return 'low';
}
export class OfflineCityGeocoder {
    index;
    constructor(index) {
        this.index = index;
    }
    reverseGeocode(lat, lon, searchRadius = 1) {
        let best = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        const keys = neighbouringBucketKeys(lat, lon, searchRadius, this.index.cellSizeDeg);
        for (const key of keys) {
            const candidates = this.index.buckets[key];
            if (!candidates)
                continue;
            for (const city of candidates) {
                const dist = haversineKm(lat, lon, city.lat, city.lon);
                if (dist < bestDistance) {
                    bestDistance = dist;
                    best = city;
                }
            }
        }
        if (!best)
            return null;
        return {
            city: best.name,
            region: best.region,
            country: best.country,
            countryCode: best.countryCode,
            latitude: best.lat,
            longitude: best.lon,
            distanceKm: Number(bestDistance.toFixed(2)),
            confidence: confidenceFromDistance(bestDistance),
            population: best.population,
        };
    }
}
