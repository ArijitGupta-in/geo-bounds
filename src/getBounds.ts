import type { Coordinate, Bounds, DMSCoordinate } from "./types.js";
import { validateCoordinate, dmsToDecimal } from "./coordinate.js";

function isDMSCoordinate(
    coord: Coordinate | DMSCoordinate
): coord is DMSCoordinate {
    return typeof coord.latitude === "object";
}

function normalize(coord: Coordinate | DMSCoordinate): Coordinate {
    let normalized: Coordinate;

    if (isDMSCoordinate(coord)) {
        normalized = dmsToDecimal(coord);
    } else {
        validateCoordinate(coord);
        normalized = coord;
    }

    return {
        latitude: normalized.latitude,
        longitude: normalized.longitude === -180 ? 180 : normalized.longitude,
    };
}

/**
 * Calculates the smallest geographic bounding box containing all coordinates.
 *
 * Longitude is treated as a circular value, allowing the resulting bounds
 * to cross the antimeridian.
 *
 * @throws {Error} If no coordinates are provided.
 * @throws {RangeError} If any coordinate is invalid.
 */
export function getBounds(coordinates: (Coordinate | DMSCoordinate)[]): Bounds {
    if (coordinates.length === 0) {
        throw new Error("At least one coordinate is required");
    }

    const normalized = coordinates.map(normalize);

    const firstCoordinate = normalized[0];

    if (firstCoordinate === undefined) {
        throw new Error("At least one coordinate is required");
    }

    let south = firstCoordinate.latitude;
    let north = firstCoordinate.latitude;

    const longitudes: number[] = [];

    for (const coordinate of normalized) {
        south = Math.min(south, coordinate.latitude);
        north = Math.max(north, coordinate.latitude);
        longitudes.push(coordinate.longitude);
    }

    longitudes.sort((a, b) => a - b);

    const firstLongitude = longitudes[0];
    const lastLongitude = longitudes[longitudes.length - 1];

    if (firstLongitude === undefined || lastLongitude === undefined) {
        throw new Error("At least one coordinate is required");
    }

    // Start with the gap that wraps from the largest longitude
    // back around to the smallest longitude.
    let largestGap = firstLongitude + 360 - lastLongitude;
    let largestGapIndex = longitudes.length - 1;

    // Find the largest gap between adjacent longitudes.
    for (let i = 0; i < longitudes.length - 1; i++) {
        const current = longitudes[i];
        const next = longitudes[i + 1];

        if (current === undefined || next === undefined) {
            continue;
        }

        const gap = next - current;

        // Use > rather than >= so that, in the case of
        // equally large gaps, the wrapping gap wins.
        if (gap > largestGap) {
            largestGap = gap;
            largestGapIndex = i;
        }
    }

    // The bounds are everything outside the largest empty gap.
    const westIndex = (largestGapIndex + 1) % longitudes.length;
    const eastIndex = largestGapIndex;

    const west = longitudes[westIndex];
    const east = longitudes[eastIndex];

    if (west === undefined || east === undefined) {
        throw new Error("At least one coordinate is required");
    }

    return {
        north,
        south,
        east,
        west,
    };
}
