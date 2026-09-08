/**
 * @arijitgupta/geo-bounds — public API surface.
 *
 * Exports the {@link distanceBetween} function and both coordinate types:
 * {@link Coordinate} (decimal degrees) and {@link DMSCoordinate} (DMS format).
 */
export type {
    Coordinate,
    DMSCoordinate,
    LatitudeDMS,
    LongitudeDMS,
    LatitudeDirection,
    LongitudeDirection,
} from "./types.js";
// export { distanceBetween } from "./distanceBetween.js";
export { validateCoordinate, dmsToDecimal } from "./coordinate.js";
