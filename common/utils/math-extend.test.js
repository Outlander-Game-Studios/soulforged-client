import uniq from "lodash/uniq.js";

describe("Math extension", function () {
  it("floorFraction", function () {
    expect(Math.floorFraction(1, 2)).toEqual(100);
    expect(Math.floorFraction(1, 3)).toEqual(1000);
    expect(Math.floorFraction(1, 0)).toEqual(1);
    expect(Math.floorFraction(100, 3)).toEqual(100000);
    expect(Math.floorFraction(9, 2)).toEqual(900);
    expect(Math.floorFraction(1.9, 2)).toEqual(190);
    expect(Math.floorFraction(1.99, 2)).toEqual(199);
    expect(Math.floorFraction(1.99999, 2)).toEqual(199);
    expect(Math.floorFraction(99.99999, 2)).toEqual(9999);
    expect(Math.floorFraction(0.9, 0)).toEqual(0);
    expect(Math.floorFraction(0.9, 1)).toEqual(9);
    expect(Math.floorFraction(0.9, 2)).toEqual(90);

    expect(Math.floorFraction(0, 0)).toEqual(0);
    expect(Math.floorFraction(0, 2)).toEqual(0);

    expect(Math.floorFraction(-1, 2)).toEqual(-100);
    expect(Math.floorFraction(-1, 3)).toEqual(-1000);
    expect(Math.floorFraction(-1, 0)).toEqual(-1);
    expect(Math.floorFraction(-100, 3)).toEqual(-100000);
    expect(Math.floorFraction(-9, 2)).toEqual(-900);
    expect(Math.floorFraction(-1.9, 2)).toEqual(-190);
    expect(Math.floorFraction(-1.99, 2)).toEqual(-199);
    expect(Math.floorFraction(-1.99999, 2)).toEqual(-199);
    expect(Math.floorFraction(-99.99999, 2)).toEqual(-9999);
    expect(Math.floorFraction(-0.9, 0)).toEqual(-0);
    expect(Math.floorFraction(-0.9, 1)).toEqual(-9);
    expect(Math.floorFraction(-0.9, 2)).toEqual(-90);
  });
});
