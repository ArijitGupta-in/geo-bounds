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

export function getBounds(coordinates: Coordinate[]): Bounds {}
