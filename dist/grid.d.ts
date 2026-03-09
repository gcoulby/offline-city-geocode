export declare function gridCell(lat: number, lon: number, cellSizeDeg?: number): [number, number];
export declare function bucketKey(latIdx: number, lonIdx: number): string;
export declare function neighbouringBucketKeys(lat: number, lon: number, radius?: number, cellSizeDeg?: number): string[];
