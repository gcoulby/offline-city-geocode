export function gridCell(lat, lon, cellSizeDeg = 1) {
    const latIdx = Math.floor((lat + 90) / cellSizeDeg);
    const lonIdx = Math.floor((lon + 180) / cellSizeDeg);
    return [latIdx, lonIdx];
}
export function bucketKey(latIdx, lonIdx) {
    return `${latIdx}:${lonIdx}`;
}
export function neighbouringBucketKeys(lat, lon, radius = 1, cellSizeDeg = 1) {
    const [baseLat, baseLon] = gridCell(lat, lon, cellSizeDeg);
    const keys = [];
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            keys.push(bucketKey(baseLat + dy, baseLon + dx));
        }
    }
    return keys;
}
