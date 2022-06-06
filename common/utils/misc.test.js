import uniq from "lodash/uniq.js";

describe("pluralize", function () {
  it("provides expected results", function () {
    expect(pluralize("roof")).toEqual("roofs");
    expect(pluralize("body")).toEqual("bodies");
    expect(pluralize("bus")).toEqual("buses");
    expect(pluralize("snake")).toEqual("snakes");
    expect(pluralize("ski")).toEqual("skis");
    expect(pluralize("Barrymore")).toEqual("Barrymores");
    expect(pluralize("witch")).toEqual("witches");
    expect(pluralize("box")).toEqual("boxes");
    expect(pluralize("gas")).toEqual("gases");
    expect(pluralize("bus")).toEqual("buses");
    expect(pluralize("kiss")).toEqual("kisses");
    expect(pluralize("Jones")).toEqual("Joneses");
    expect(pluralize("nucleus")).toEqual("nuclei");
    expect(pluralize("syllabus")).toEqual("syllabi");
    expect(pluralize("focus")).toEqual("foci");
    expect(pluralize("fungus")).toEqual("fungi");
    expect(pluralize("cactus")).toEqual("cacti");
    expect(pluralize("thesis")).toEqual("theses");
    expect(pluralize("crisis")).toEqual("crises");
    expect(pluralize("phenomenon")).toEqual("phenomena");
    expect(pluralize("index")).toEqual("indices");
    expect(pluralize("appendix")).toEqual("appendices");
    expect(pluralize("criterion")).toEqual("criteria");
  });
});

describe("preposition", function () {
  it("provides expected results", function () {
    expect(preposition("operation")).toEqual("an operation");
    expect(preposition("idea")).toEqual("an idea");
    expect(preposition("apple")).toEqual("an apple");
    expect(preposition("toy")).toEqual("a toy");
    expect(preposition("book")).toEqual("a book");
    expect(preposition("house")).toEqual("a house");
    expect(preposition("Operation")).toEqual("An operation");
    expect(preposition("Idea")).toEqual("An idea");
    expect(preposition("Apple")).toEqual("An apple");
    expect(preposition("Toy")).toEqual("A toy");
    expect(preposition("Book")).toEqual("A book");
    expect(preposition("House")).toEqual("A house");
  });
});
