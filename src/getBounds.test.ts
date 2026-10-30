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

    it("returns bounds for multiple coordinates", () => {
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

    it("returns a zero-width box for duplicate coordinates", () => {
        const point = { latitude: 5, longitude: 40 };

        expect(getBounds([point, point, { ...point }])).toEqual({
            north: 5,
            south: 5,
            east: 40,
            west: 40,
        });
    });

    it("handles duplicate longitudes alongside other longitudes", () => {
        const coordinates = [
            { latitude: 0, longitude: 10 },
            { latitude: 1, longitude: 10 },
            { latitude: 2, longitude: 30 },
            { latitude: 3, longitude: 30 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 3,
            south: 0,
            east: 30,
            west: 10,
        });
    });

    it("treats longitude -180 as the canonical 180", () => {
        expect(getBounds([{ latitude: 0, longitude: -180 }])).toEqual({
            north: 0,
            south: 0,
            east: 180,
            west: 180,
        });
    });

    it("keeps -180 and 180 together as one meridian", () => {
        const coordinates = [
            { latitude: 0, longitude: -180 },
            { latitude: 10, longitude: 180 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 10,
            south: 0,
            east: 180,
            west: 180,
        });
    });

    it("crosses the antimeridian when a coordinate sits on 180", () => {
        const coordinates = [
            { latitude: 0, longitude: 170 },
            { latitude: 0, longitude: 180 },
            { latitude: 0, longitude: -170 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 0,
            south: 0,
            east: -170,
            west: 170,
        });
    });

    it("prefers the wrapping gap when gaps are equal", () => {
        const coordinates = [
            { latitude: 0, longitude: -90 },
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 90 },
            { latitude: 0, longitude: 180 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 0,
            south: 0,
            east: 180,
            west: -90,
        });
    });

    it("throws when given no coordinates", () => {
        expect(() => getBounds([])).toThrow(
            "At least one coordinate is required"
        );
    });

    it("rejects fractional DMS degrees using shared validation", () => {
        expect(() =>
            getBounds([
                {
                    latitude: {
                        degrees: 1.5,
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
                },
            ])
        ).toThrow(RangeError);
    });

    it("uses a non-wrapping bound when longitude span is exactly 180 degrees", () => {
        const coordinates = [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 180 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 0,
            south: 0,
            east: 180,
            west: 0,
        });
    });

    it("handles 180° and -180° as the same meridian", () => {
        const coordinates = [
            { latitude: 0, longitude: 180 },
            { latitude: 0, longitude: -180 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 0,
            south: 0,
            east: 180,
            west: 180,
        });
    });

    it("handles multiple coordinates containing both 180° and -180°", () => {
        const coordinates = [
            { latitude: 10, longitude: 180 },
            { latitude: 20, longitude: -180 },
            { latitude: 15, longitude: 179 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: 10,
            east: 180,
            west: 179,
        });
    });

    it("uses a deterministic non-wrapping bound for points exactly 180° apart", () => {
        const coordinates = [
            { latitude: 0, longitude: 0 },
            { latitude: 0, longitude: 180 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 0,
            south: 0,
            east: 180,
            west: 0,
        });
    });

    it("handles duplicate coordinates", () => {
        const coordinates = [
            { latitude: 10, longitude: 20 },
            { latitude: 10, longitude: 20 },
            { latitude: 10, longitude: 20 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 10,
            south: 10,
            east: 20,
            west: 20,
        });
    });

    it("handles coordinates with the same longitude", () => {
        const coordinates = [
            { latitude: 10, longitude: 50 },
            { latitude: 20, longitude: 50 },
            { latitude: -5, longitude: 50 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: -5,
            east: 50,
            west: 50,
        });
    });

    it("handles multiple coordinates crossing the antimeridian", () => {
        const coordinates = [
            { latitude: 10, longitude: 175 },
            { latitude: 20, longitude: 179 },
            { latitude: 15, longitude: -179 },
            { latitude: 5, longitude: -175 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: 5,
            east: -175,
            west: 175,
        });
    });

    it("handles a normal longitude span of exactly 180°", () => {
        const coordinates = [
            { latitude: 10, longitude: -90 },
            { latitude: 20, longitude: 90 },
        ];

        expect(getBounds(coordinates)).toEqual({
            north: 20,
            south: 10,
            east: 90,
            west: -90,
        });
    });
});
