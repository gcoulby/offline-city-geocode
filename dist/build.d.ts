import type { BucketedIndex } from './types.js';
type BuildOptions = {
    citiesPath: string;
    countryInfoPath: string;
    admin1Path: string;
    outPath: string;
    cellSizeDeg?: number;
};
export declare function buildIndex(options: BuildOptions): BucketedIndex;
export {};
