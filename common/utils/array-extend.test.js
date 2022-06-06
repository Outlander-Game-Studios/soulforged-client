import "./array-extend.js";

describe("test array methods", function () {
  it("removes the item from the array", function () {
    const array = [1, 2, 3];
    array.remove(2);
    expect(array).toEqual([1, 3]);
  });

  it("removes the item even if it's first", function () {
    const array = [1, 2, 3];
    array.remove(1);
    expect(array).toEqual([2, 3]);
  });

  it("removes the item even if it's last", function () {
    const array = [1, 2, 3];
    array.remove(3);
    expect(array).toEqual([1, 2]);
  });
  it("removes objects", function () {
    const testObject = {};
    const array = [1, testObject, 3];
    array.remove(testObject);
    expect(array).toEqual([1, 3]);
  });
  it("throws error if not found", function () {
    const array = [1, 2, 3];
    expect(() => array.remove(4)).toThrow();
  });
  it("object match requires the same instance", function () {
    const present = {};
    const absent = {};
    const array = [1, present, 3];
    expect(() => array.remove(absent)).toThrow();
  });
  it("only first instance is removed", function () {
    const array = [1, 2, 3, 2];
    array.remove(2);
    expect(array).toEqual([1, 3, 2]);
  });
  it("can use a function to remove the element", function () {
    const array = [1, 2, 3];
    array.remove((element) => element === 2);
    expect(array).toEqual([1, 3]);
  });
});
