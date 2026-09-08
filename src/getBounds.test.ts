import { describe, expect, it } from "vitest";
import { getBounds } from "./index.js";

describe("getBounds", () => {
    it("returns bounds for a single coordinate", () => {
        const coordinate = {
            latitude: 22.5726,
            longitude: 88.3639,
        };

        expect(getBounds([coordinate])).toEqual({
            north: 22.5726,
            south: 22.5726,
            east: 88.3639,
            west: 88.3639,
        });
    });

    it("returns the minimum and maximum latitude and longitude", () => {
        const coordinates = [
            { latitude: 22.5726, longitude: 88.3639 },
            { latitude: 22.595, longitude: 88.4 },
            { latitude: 22.55, longitude: 88.34 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 22.595,
            south: 22.55,
            east: 88.4,
            west: 88.34,
        });
    });

    it("returns wrapping bounds when coordinates cross the antimeridian", () => {
        const coordinates = [
            { latitude: 10, longitude: 179 },
            { latitude: 20, longitude: -179 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: 10,
            east: -179,
            west: 179,
        });
    });

    it("returns the smallest wrapping bounds for multiple coordinates", () => {
        const coordinates = [
            { latitude: 10, longitude: 170 },
            { latitude: 20, longitude: -170 },
            { latitude: 15, longitude: -160 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: 10,
            east: -160,
            west: 170,
        });
    });

    it("throws when given no coordinates", () => {
        expect(() => getBounds([])).toThrow();
    });

    it("accepts DMS coordinates", () => {
        const coordinates = [
            {
                latitude: {
                    degrees: 22,
                    minutes: 34,
                    seconds: 21.36,
                    direction: "N" as const,
                },
                longitude: {
                    degrees: 88,
                    minutes: 21,
                    seconds: 50.04,
                    direction: "E" as const,
                },
            },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 22.5726,
            south: 22.5726,
            east: 88.3639,
            west: 88.3639,
        });
    });
});
