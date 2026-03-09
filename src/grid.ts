export function gridCell(lat: number, lon: number, cellSizeDeg = 1): [number, number] {
  const latIdx = Math.floor((lat + 90) / cellSizeDeg)
  const lonIdx = Math.floor((lon + 180) / cellSizeDeg)
  return [latIdx, lonIdx]
}

export function bucketKey(latIdx: number, lonIdx: number): string {
  return `${latIdx}:${lonIdx}`
}

export function neighbouringBucketKeys(lat: number, lon: number, radius = 1, cellSizeDeg = 1): string[] {
  const [baseLat, baseLon] = gridCell(lat, lon, cellSizeDeg)
  const keys: string[] = []

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      keys.push(bucketKey(baseLat + dy, baseLon + dx))
    }
  }

  return keys
}
