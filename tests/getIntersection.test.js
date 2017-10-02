import intersect from "../src/getIntersection"

describe("getIntersection", () => {
    test("should get bottom most when new is beyond old", () => { 
        expect(intersect(75, 50, 50, 50)).toEqual({ height: 25, x: 62.5 });
    });

    test("should get top most when new is before old", () => { 
        expect(intersect(50, 50, 35, 50)).toEqual({ height: 15, x: 42.5 });
    });
})