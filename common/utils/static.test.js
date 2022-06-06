import uniq from "lodash/uniq.js";

describe("REQUEST_CODES", function () {
  it("are unique", function () {
    const codes = Object.values(REQUEST_CODES);
    expect(uniq(codes).length).toEqual(codes.length);
  });
});
