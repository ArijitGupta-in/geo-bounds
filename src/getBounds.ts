import type { Coordinate, Bounds, DMSCoordinate } from "./types.js";
import { validateCoordinate, dmsToDecimal } from "./coordinate.js";

function isDMSCoordinate(
    coord: Coordinate | DMSCoordinate
): coord is DMSCoordinate {
    return typeof coord.latitude === "object";
}

function normalize(coord: Coordinate | DMSCoordinate): Coordinate {
    if (isDMSCoordinate(coord)) {
        return dmsToDecimal(coord);
    }

    validateCoordinate(coord);
    return coord;
}

/**
 * Calculates the smallest geographic bounding box containing all coordinates.
 *
 * Longitude is treated as a circular value, allowing the resulting bounds
 * to cross the antimeridian.
 *
 * @throws {RangeError} If any coordinate is invalid.
 * @throws {Error} If no coordinates are provided.
 */
export function getBounds(coordinates: (Coordinate | DMSCoordinate)[]): Bounds {
    if (coordinates.length === 0) {
        throw new Error("At least one coordinate is required");
    }

    const normalized = coordinates.map(normalize);

    let south = normalized[0].latitude;
    let north = normalized[0].latitude;

    const longitudes: number[] = [];

    for (const coordinate of normalized) {
        south = Math.min(south, coordinate.latitude);
        north = Math.max(north, coordinate.latitude);
        longitudes.push(coordinate.longitude);
    }

    longitudes.sort((a, b) => a - b);

    let largestGap = longitudes[0] + 360 - longitudes[longitudes.length - 1];
    let largestGapIndex = longitudes.length - 1;

    for (let i = 0; i < longitudes.length - 1; i++) {
        const gap = longitudes[i + 1] - longitudes[i];

        if (gap > largestGap) {
            largestGap = gap;
            largestGapIndex = i;
        }
    }

    const westIndex = (largestGapIndex + 1) % longitudes.length;
    const eastIndex = largestGapIndex;

    return {
        north,
        south,
        east: longitudes[eastIndex],
        west: longitudes[westIndex],
    };
}
