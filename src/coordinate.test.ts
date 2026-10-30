import * as geoCore from "@arijitgupta/geo-core";
import { describe, expect, it } from "vitest";
import * as coordinate from "./coordinate.js";
import { dmsToDecimal, validateCoordinate } from "./index.js";

// Validation and conversion behavior is owned and tested by geo-core; these
// tests only guard that the re-exports stay wired to it.
describe("geo-core re-exports", () => {
    it("re-exports the geo-core implementations", () => {
        expect(coordinate.dmsToDecimal).toBe(geoCore.dmsToDecimal);
        expect(coordinate.latitudeDMSToDecimal).toBe(
            geoCore.latitudeDMSToDecimal
        );
        expect(coordinate.longitudeDMSToDecimal).toBe(
            geoCore.longitudeDMSToDecimal
        );
        expect(coordinate.validateCoordinate).toBe(geoCore.validateCoordinate);
    });

    it("exposes validateCoordinate and dmsToDecimal from the package entry point", () => {
        expect(validateCoordinate).toBe(geoCore.validateCoordinate);
        expect(dmsToDecimal).toBe(geoCore.dmsToDecimal);
    });

    it("converts and validates through the public API", () => {
        const result = dmsToDecimal({
            latitude: {
                degrees: 22,
                minutes: 34,
                seconds: 21.36,
                direction: "S",
            },
            longitude: {
                degrees: 88,
                minutes: 21,
                seconds: 50.04,
                direction: "W",
            },
        });
        expect(result.latitude).toBeCloseTo(-22.5726, 10);
        expect(result.longitude).toBeCloseTo(-88.3639, 10);
        expect(() =>
            validateCoordinate({ latitude: 91, longitude: 0 })
        ).toThrow(RangeError);
    });
});
