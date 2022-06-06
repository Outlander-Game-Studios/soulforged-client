describe("random", function () {
  it("can include additional precision", function () {
    let pass = 0;
    const times = 10000;
    const chance = 0.25;
    for (let i = 0; i < times; i++) {
      pass += random.chance(chance * 100, 1, 4) ? 1 : 0;
    }
    expect(pass / times).toBeCloseTo(chance);
  });

  it("can include additional precision", function () {
    let pass = 0;
    const times = 10000;
    const chance = 0.75;
    for (let i = 0; i < times; i++) {
      pass += random.chance(chance * 100, 1, 4) ? 1 : 0;
    }
    expect(pass / times).toBeCloseTo(chance);
  });
});
