/**
 * @arijitgupta/geo-bounds — public API surface.
 *
 * Exports the {@link getBounds} function, the {@link Bounds} type, and both coordinate types:
 * {@link Coordinate} (decimal degrees) and {@link DMSCoordinate} (DMS format).
 */
export type {
    Coordinate,
    DMSCoordinate,
    LatitudeDMS,
    LongitudeDMS,
    LatitudeDirection,
    LongitudeDirection,
    Bounds,
} from "./types.js";
export { getBounds } from "./getBounds.js";
export { validateCoordinate, dmsToDecimal } from "./coordinate.js";
