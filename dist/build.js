import fs from 'node:fs';
import path from 'node:path';
import { gridCell, bucketKey } from './grid.js';
function readTextFileMaybeZip(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (filePath.toLowerCase().endsWith('.zip')) {
        const signature = buffer.subarray(0, 4).toString('hex');
        if (signature !== '504b0304') {
            throw new Error(`Expected zip file: ${filePath}`);
        }
        // crude but effective: find first .txt content via unzip from Node is awkward without deps
        // so for zero-dependency use, require extracted txt if zip parsing matters
        throw new Error('Zip reading without dependencies is intentionally not implemented. Extract cities15000.txt first.');
    }
    return buffer.toString('utf8');
}
function parseCountryInfo(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const map = new Map();
    for (const line of text.split(/\r?\n/)) {
        if (!line || line.startsWith('#'))
            continue;
        const cols = line.split('\t');
        const countryCode = cols[0];
        const countryName = cols[4];
        if (countryCode && countryName) {
            map.set(countryCode, countryName);
        }
    }
    return map;
}
function parseAdmin1(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const map = new Map();
    for (const line of text.split(/\r?\n/)) {
        if (!line)
            continue;
        const cols = line.split('\t');
        const key = cols[0];
        const name = cols[1];
        if (key && name) {
            map.set(key, name);
        }
    }
    return map;
}
function parseCities(citiesPath, countryMap, admin1Map, cellSizeDeg) {
    const text = readTextFileMaybeZip(citiesPath);
    const buckets = {};
    for (const line of text.split(/\r?\n/)) {
        if (!line)
            continue;
        const cols = line.split('\t');
        if (cols.length < 15)
            continue;
        const id = Number(cols[0]);
        const name = cols[1];
        const asciiName = cols[2];
        const lat = Number(cols[4]);
        const lon = Number(cols[5]);
        const countryCode = cols[8];
        const admin1Code = cols[10] || null;
        const population = Number(cols[14] || 0);
        if (!Number.isFinite(lat) || !Number.isFinite(lon))
            continue;
        if (!countryCode || !name)
            continue;
        const regionKey = admin1Code ? `${countryCode}.${admin1Code}` : null;
        const city = {
            id,
            name,
            asciiName,
            lat,
            lon,
            countryCode,
            country: countryMap.get(countryCode) ?? null,
            admin1Code,
            region: regionKey ? (admin1Map.get(regionKey) ?? null) : null,
            population,
        };
        const [latIdx, lonIdx] = gridCell(lat, lon, cellSizeDeg);
        const key = bucketKey(latIdx, lonIdx);
        if (!buckets[key])
            buckets[key] = [];
        buckets[key].push(city);
    }
    return {
        version: 1,
        cellSizeDeg,
        buckets,
    };
}
export function buildIndex(options) {
    const cellSizeDeg = options.cellSizeDeg ?? 1;
    const countryMap = parseCountryInfo(options.countryInfoPath);
    const admin1Map = parseAdmin1(options.admin1Path);
    const index = parseCities(options.citiesPath, countryMap, admin1Map, cellSizeDeg);
    fs.mkdirSync(path.dirname(options.outPath), { recursive: true });
    fs.writeFileSync(options.outPath, JSON.stringify(index));
    return index;
}
function getArg(name) {
    const prefix = `--${name}=`;
    return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}
if (process.argv[1] && process.argv[1].endsWith('build.js')) {
    const citiesPath = getArg('cities');
    const countryInfoPath = getArg('countryInfo');
    const admin1Path = getArg('admin1');
    const outPath = getArg('out');
    const cellSizeArg = getArg('cellSizeDeg');
    if (!citiesPath || !countryInfoPath || !admin1Path || !outPath) {
        console.error('Usage: node dist/build.js --cities=./data/cities15000.txt --countryInfo=./data/countryInfo.txt --admin1=./data/admin1CodesASCII.txt --out=./data/index.json [--cellSizeDeg=1]');
        process.exit(1);
    }
    buildIndex({
        citiesPath,
        countryInfoPath,
        admin1Path,
        outPath,
        cellSizeDeg: cellSizeArg ? Number(cellSizeArg) : 1,
    });
    console.log(`Built index at ${outPath}`);
}
