import { describe, expect, it } from "vitest";
import {
    validateCoordinate,
    dmsToDecimal,
    latitudeDMSToDecimal,
    longitudeDMSToDecimal,
} from "./coordinate.js";

describe("validateCoordinate", () => {
    it("accepts valid coordinates at the origin", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: 0 })
        ).not.toThrow();
    });

    it("accepts boundary latitude +90", () => {
        expect(() =>
            validateCoordinate({ latitude: 90, longitude: 0 })
        ).not.toThrow();
    });

    it("accepts boundary latitude -90", () => {
        expect(() =>
            validateCoordinate({ latitude: -90, longitude: 0 })
        ).not.toThrow();
    });

    it("accepts boundary longitude +180", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: 180 })
        ).not.toThrow();
    });

    it("accepts boundary longitude -180", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: -180 })
        ).not.toThrow();
    });

    it("throws RangeError for latitude above 90", () => {
        expect(() =>
            validateCoordinate({ latitude: 91, longitude: 0 })
        ).toThrow(RangeError);
    });

    it("throws RangeError for latitude below -90", () => {
        expect(() =>
            validateCoordinate({ latitude: -91, longitude: 0 })
        ).toThrow(RangeError);
    });

    it("throws RangeError for longitude above 180", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: 181 })
        ).toThrow(RangeError);
    });

    it("throws RangeError for longitude below -180", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: -181 })
        ).toThrow(RangeError);
    });

    it("throws RangeError for non-finite latitude", () => {
        expect(() =>
            validateCoordinate({ latitude: Infinity, longitude: 0 })
        ).toThrow(RangeError);
        expect(() =>
            validateCoordinate({ latitude: NaN, longitude: 0 })
        ).toThrow(RangeError);
    });

    it("throws RangeError for non-finite longitude", () => {
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: Infinity })
        ).toThrow(RangeError);
        expect(() =>
            validateCoordinate({ latitude: 0, longitude: NaN })
        ).toThrow(RangeError);
    });
});

describe("latitudeDMSToDecimal", () => {
    it("converts North to a positive decimal", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 22,
                minutes: 34,
                seconds: 21.36,
                direction: "N",
            })
        ).toBeCloseTo(22.5726, 4);
    });

    it("converts South to a negative decimal", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 33,
                minutes: 51,
                seconds: 54,
                direction: "S",
            })
        ).toBeCloseTo(-33.865, 3);
    });

    it("returns 0 for zero values with N direction", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: 0,
                seconds: 0,
                direction: "N",
            })
        ).toBe(0);
    });

    it("returns 0 for zero values with S direction", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: 0,
                seconds: 0,
                direction: "S",
            })
        ).toBe(-0);
    });

    it("accepts the boundary value 90°N", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 90,
                minutes: 0,
                seconds: 0,
                direction: "N",
            })
        ).toBe(90);
    });

    it("accepts the boundary value 90°S", () => {
        expect(
            latitudeDMSToDecimal({
                degrees: 90,
                minutes: 0,
                seconds: 0,
                direction: "S",
            })
        ).toBe(-90);
    });

    it("throws RangeError for degrees above 90", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 91,
                minutes: 0,
                seconds: 0,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for negative degrees", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: -1,
                minutes: 0,
                seconds: 0,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for minutes equal to 60", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: 60,
                seconds: 0,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for negative minutes", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: -1,
                seconds: 0,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for seconds equal to 60", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: 0,
                seconds: 60,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for negative seconds", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 0,
                minutes: 0,
                seconds: -1,
                direction: "N",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError when combined value exceeds 90°", () => {
        expect(() =>
            latitudeDMSToDecimal({
                degrees: 90,
                minutes: 0,
                seconds: 1,
                direction: "N",
            })
        ).toThrow(RangeError);
    });
});

describe("longitudeDMSToDecimal", () => {
    it("converts East to a positive decimal", () => {
        expect(
            longitudeDMSToDecimal({
                degrees: 88,
                minutes: 21,
                seconds: 50.04,
                direction: "E",
            })
        ).toBeCloseTo(88.3639, 4);
    });

    it("converts West to a negative decimal", () => {
        expect(
            longitudeDMSToDecimal({
                degrees: 74,
                minutes: 0,
                seconds: 23,
                direction: "W",
            })
        ).toBeCloseTo(-74.006, 3);
    });

    it("accepts the boundary value 180°E", () => {
        expect(
            longitudeDMSToDecimal({
                degrees: 180,
                minutes: 0,
                seconds: 0,
                direction: "E",
            })
        ).toBe(180);
    });

    it("accepts the boundary value 180°W", () => {
        expect(
            longitudeDMSToDecimal({
                degrees: 180,
                minutes: 0,
                seconds: 0,
                direction: "W",
            })
        ).toBe(-180);
    });

    it("throws RangeError for degrees above 180", () => {
        expect(() =>
            longitudeDMSToDecimal({
                degrees: 181,
                minutes: 0,
                seconds: 0,
                direction: "E",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for negative degrees", () => {
        expect(() =>
            longitudeDMSToDecimal({
                degrees: -1,
                minutes: 0,
                seconds: 0,
                direction: "E",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for minutes equal to 60", () => {
        expect(() =>
            longitudeDMSToDecimal({
                degrees: 0,
                minutes: 60,
                seconds: 0,
                direction: "E",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError for seconds equal to 60", () => {
        expect(() =>
            longitudeDMSToDecimal({
                degrees: 0,
                minutes: 0,
                seconds: 60,
                direction: "E",
            })
        ).toThrow(RangeError);
    });

    it("throws RangeError when combined value exceeds 180°", () => {
        expect(() =>
            longitudeDMSToDecimal({
                degrees: 180,
                minutes: 1,
                seconds: 0,
                direction: "E",
            })
        ).toThrow(RangeError);
    });
});

describe("dmsToDecimal", () => {
    it("converts a full DMSCoordinate to decimal degrees", () => {
        const result = dmsToDecimal({
            latitude: {
                degrees: 22,
                minutes: 34,
                seconds: 21.36,
                direction: "N",
            },
            longitude: {
                degrees: 88,
                minutes: 21,
                seconds: 50.04,
                direction: "E",
            },
        });

        expect(result.latitude).toBeCloseTo(22.5726, 4);
        expect(result.longitude).toBeCloseTo(88.3639, 4);
    });

    it("handles southern hemisphere coordinates", () => {
        const result = dmsToDecimal({
            latitude: { degrees: 33, minutes: 51, seconds: 54, direction: "S" },
            longitude: {
                degrees: 151,
                minutes: 12,
                seconds: 34,
                direction: "E",
            },
        });

        expect(result.latitude).toBeCloseTo(-33.865, 3);
        expect(result.longitude).toBeCloseTo(151.209, 3);
    });

    it("handles western hemisphere coordinates", () => {
        const result = dmsToDecimal({
            latitude: { degrees: 40, minutes: 42, seconds: 46, direction: "N" },
            longitude: { degrees: 74, minutes: 0, seconds: 21, direction: "W" },
        });

        expect(result.latitude).toBeCloseTo(40.713, 3);
        expect(result.longitude).toBeCloseTo(-74.006, 3);
    });

    it("propagates validation errors from latitude", () => {
        expect(() =>
            dmsToDecimal({
                latitude: {
                    degrees: 91,
                    minutes: 0,
                    seconds: 0,
                    direction: "N",
                },
                longitude: {
                    degrees: 0,
                    minutes: 0,
                    seconds: 0,
                    direction: "E",
                },
            })
        ).toThrow(RangeError);
    });

    it("propagates validation errors from longitude", () => {
        expect(() =>
            dmsToDecimal({
                latitude: {
                    degrees: 0,
                    minutes: 0,
                    seconds: 0,
                    direction: "N",
                },
                longitude: {
                    degrees: 181,
                    minutes: 0,
                    seconds: 0,
                    direction: "E",
                },
            })
        ).toThrow(RangeError);
    });
});
