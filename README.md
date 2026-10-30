# @arijitgupta/geo-bounds

[![npm version](https://img.shields.io/npm/v/@arijitgupta/geo-bounds)](https://www.npmjs.com/package/@arijitgupta/geo-bounds)
[![license](https://img.shields.io/npm/l/@arijitgupta/geo-bounds)](https://opensource.org/licenses/MIT)

A lightweight TypeScript utility for calculating the smallest geographic bounding box containing a set of coordinates. Shared coordinate types, conversion, and validation are provided by [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core).

Accepts coordinates in **decimal degrees** or **Degrees, Minutes, Seconds (DMS)** format. Longitude is treated as a circular value, so bounds can cross the antimeridian.

## Installation

```bash
npm install @arijitgupta/geo-bounds
```

## Usage

### Decimal degrees

```ts
import {
    getBounds,
    type Coordinate,
} from "@arijitgupta/geo-bounds";

const coordinates: Coordinate[] = [
    { latitude: 22.5726, longitude: 88.3639 },
    { latitude: 22.595, longitude: 88.4 },
    { latitude: 22.55, longitude: 88.34 },
];

const bounds = getBounds(coordinates);
// { north: 22.595, south: 22.55, east: 88.4, west: 88.34 }
```

### Antimeridian-crossing bounds

When the smallest box crosses the antimeridian, `west` is greater than `east`.

```ts
import { getBounds } from "@arijitgupta/geo-bounds";

const bounds = getBounds([
    { latitude: 10, longitude: 179 },
    { latitude: 20, longitude: -179 },
]);

// { north: 20, south: 10, east: -179, west: 179 }
```

### DMS coordinates

```ts
import {
    getBounds,
    type DMSCoordinate,
} from "@arijitgupta/geo-bounds";

const coordinates: DMSCoordinate[] = [
    {
        latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
        longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
    },
];

const bounds = getBounds(coordinates);
// { north: 22.5726, south: 22.5726, east: 88.3639, west: 88.3639 }
```

Decimal and DMS coordinates can be mixed in the same array.

### Converting DMS to decimal degrees

```ts
import {
    dmsToDecimal,
    type DMSCoordinate,
} from "@arijitgupta/geo-bounds";

const dms: DMSCoordinate = {
    latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
    longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
};

const decimal = dmsToDecimal(dms);
// { latitude: 22.5726, longitude: 88.3639 }
```

## API

### `getBounds(coordinates)`

Returns the smallest geographic bounding box containing all supplied coordinates.

| Parameter | Type | Description |
| --- | --- | --- |
| `coordinates` | `(Coordinate \| DMSCoordinate)[]` | One or more geographic coordinates |

**Returns:** `Bounds` - the northernmost, southernmost, easternmost, and westernmost limits.

**Throws:** `Error` if the array is empty.

**Throws:** `RangeError` if a coordinate is out of range or DMS degrees/minutes
are not integers.
**Throws:** `TypeError` if coordinate fields or DMS directions have invalid types,
or if a decimal coordinate value is not finite.

The longitude calculation treats `-180` and `180` as the same meridian. For a box that crosses the antimeridian, `west` is greater than `east`.

### `dmsToDecimal(dms)`

Converts a `DMSCoordinate` to a decimal-degree `Coordinate`.

**Throws:** `RangeError` if any DMS component is out of range or degrees/minutes
are not integers.
**Throws:** `TypeError` if a DMS component has an invalid type or direction.

### `validateCoordinate(coordinate)`

Validates a decimal-degree `Coordinate`.

**Throws:** `RangeError` if latitude is outside `[-90, 90]` or longitude is outside
`[-180, 180]`.
**Throws:** `TypeError` if coordinate fields are invalid or either value is not finite.

### `Coordinate`

```ts
interface Coordinate {
    latitude: number;   // -90 to 90
    longitude: number;  // -180 to 180
}
```

### `DMSCoordinate`

```ts
interface DMSCoordinate {
    latitude:  LatitudeDMS;
    longitude: LongitudeDMS;
}

interface LatitudeDMS {
    degrees:   number;             // 0-90
    minutes:   number;             // 0-59
    seconds:   number;             // 0-<60
    direction: "N" | "S";
}

interface LongitudeDMS {
    degrees:   number;             // 0-180
    minutes:   number;             // 0-59
    seconds:   number;             // 0-<60
    direction: "E" | "W";
}
```

**Validation rules:**

- `minutes` must be in `[0, 60)`.
- `degrees` and `minutes` must be integers.
- `seconds` must be in `[0, 60)`.
- `latitude.degrees` must be in `[0, 90]`; the combined value must not exceed 90 degrees.
- `longitude.degrees` must be in `[0, 180]`; the combined value must not exceed 180 degrees.

### `Bounds`

```ts
type Bounds = {
    north: number;
    south: number;
    east: number;
    west: number;
};
```

## Upgrading from 1.x

Version 2.0.0 uses [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core)
for coordinate types, conversion, normalization, and validation. When upgrading:

- DMS degrees and minutes must be integers; fractional seconds remain supported.
- Invalid DMS directions and non-finite decimal coordinate values throw `TypeError`.
- Converting a south/west DMS coordinate whose magnitude is zero now returns positive zero.

## Behavior

- Uses the minimum and maximum latitude values for `south` and `north`.
- Finds the largest empty gap between longitudes and returns everything outside that gap as the smallest longitude interval.
- Supports bounds that cross the antimeridian.
- Uses a deterministic non-wrapping result when multiple longitude intervals are equally small.
- Uses `@arijitgupta/geo-core` for shared geographic utilities.

## Development

```bash
npm install            # install dev dependencies
npm test               # run tests with Vitest
npm run test:coverage  # run tests and enforce the 80% coverage threshold
npm run check          # type-check source and tests without emitting output
npm run lint:md        # lint Markdown files
npm run build          # compile TypeScript to dist/
```

## License

MIT
