import { describe, expect, it } from "vitest";

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
});
