import { DEGREES_PER_CIRCLE, normalizeCoordinate } from "@arijitgupta/geo-core";
import type { Bounds, Coordinate, DMSCoordinate } from "./types.js";

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

    let south = Infinity;
    let north = -Infinity;
    const longitudes: number[] = [];

    for (const input of coordinates) {
        const { latitude, longitude } = normalizeCoordinate(input);
        south = Math.min(south, latitude);
        north = Math.max(north, latitude);
        longitudes.push(longitude);
    }

    longitudes.sort((a, b) => a - b);

    // The array is non-empty, so every index read below is defined.
    const count = longitudes.length;

    // Start with the gap that wraps from the largest longitude
    // back around to the smallest longitude.
    let largestGap =
        longitudes[0]! + DEGREES_PER_CIRCLE - longitudes[count - 1]!;
    let largestGapIndex = count - 1;

    // Find the largest gap between adjacent longitudes.
    for (let i = 0; i < count - 1; i++) {
        const gap = longitudes[i + 1]! - longitudes[i]!;

        // Use > rather than >= so that, in the case of
        // equally large gaps, the wrapping gap wins.
        if (gap > largestGap) {
            largestGap = gap;
            largestGapIndex = i;
        }
    }

    // The bounds are everything outside the largest empty gap.
    return {
        north,
        south,
        east: longitudes[largestGapIndex]!,
        west: longitudes[(largestGapIndex + 1) % count]!,
    };
}
