import type {
    Coordinate,
    LatitudeDMS,
    LongitudeDMS,
    DMSCoordinate,
} from "./types.js";

/**
 * Validates a decimal-degree {@link Coordinate}.
 *
 * @throws {RangeError} If latitude is outside [-90, 90] or longitude is outside [-180, 180].
 */
export function validateCoordinate(coord: Coordinate): void {
    if (
        !Number.isFinite(coord.latitude) ||
        coord.latitude < -90 ||
        coord.latitude > 90
    ) {
        throw new RangeError(
            `Latitude must be between -90 and 90, got ${coord.latitude}`
        );
    }
    if (
        !Number.isFinite(coord.longitude) ||
        coord.longitude < -180 ||
        coord.longitude > 180
    ) {
        throw new RangeError(
            `Longitude must be between -180 and 180, got ${coord.longitude}`
        );
    }
}

function validateMinutes(minutes: number): void {
    if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 60) {
        throw new RangeError(`Minutes must be within 0–59, got ${minutes}`);
    }
}

function validateSeconds(seconds: number): void {
    if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 60) {
        throw new RangeError(`Seconds must be within 0–59, got ${seconds}`);
    }
}

function validateLatitudeDMS(lat: LatitudeDMS): void {
    if (!Number.isFinite(lat.degrees) || lat.degrees < 0 || lat.degrees > 90) {
        throw new RangeError(
            `Latitude degrees must be between 0 and 90, got ${lat.degrees}`
        );
    }
    validateMinutes(lat.minutes);
    validateSeconds(lat.seconds);

    const decimal = lat.degrees + lat.minutes / 60 + lat.seconds / 3600;
    if (decimal > 90) {
        throw new RangeError(
            `Latitude must remain within ±90°, computed ${decimal}°`
        );
    }
}

function validateLongitudeDMS(lon: LongitudeDMS): void {
    if (!Number.isFinite(lon.degrees) || lon.degrees < 0 || lon.degrees > 180) {
        throw new RangeError(
            `Longitude degrees must be between 0 and 180, got ${lon.degrees}`
        );
    }
    validateMinutes(lon.minutes);
    validateSeconds(lon.seconds);

    const decimal = lon.degrees + lon.minutes / 60 + lon.seconds / 3600;
    if (decimal > 180) {
        throw new RangeError(
            `Longitude must remain within ±180°, computed ${decimal}°`
        );
    }
}

/**
 * Converts a {@link LatitudeDMS} to decimal degrees.
 * N produces a positive value; S produces a negative value.
 *
 * @throws {RangeError} If degrees, minutes, or seconds are out of range.
 */
export function latitudeDMSToDecimal(lat: LatitudeDMS): number {
    validateLatitudeDMS(lat);
    const decimal = lat.degrees + lat.minutes / 60 + lat.seconds / 3600;
    return lat.direction === "S" ? -decimal : decimal;
}

/**
 * Converts a {@link LongitudeDMS} to decimal degrees.
 * E produces a positive value; W produces a negative value.
 *
 * @throws {RangeError} If degrees, minutes, or seconds are out of range.
 */
export function longitudeDMSToDecimal(lon: LongitudeDMS): number {
    validateLongitudeDMS(lon);
    const decimal = lon.degrees + lon.minutes / 60 + lon.seconds / 3600;
    return lon.direction === "W" ? -decimal : decimal;
}

/**
 * Converts a {@link DMSCoordinate} to a decimal-degree {@link Coordinate}.
 *
 * @throws {RangeError} If any DMS component is out of range.
 *
 * @example
 * ```ts
 * const dms: DMSCoordinate = {
 *     latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
 *     longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
 * };
 * dmsToDecimal(dms); // { latitude: 22.5726, longitude: 88.3639 }
 * ```
 */
export function dmsToDecimal(dms: DMSCoordinate): Coordinate {
    return {
        latitude: latitudeDMSToDecimal(dms.latitude),
        longitude: longitudeDMSToDecimal(dms.longitude),
    };
}
