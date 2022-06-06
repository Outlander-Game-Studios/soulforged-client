import "./@utils.js";

[
  {
    position: 216,
    accidentGrade: 0,
  },
  {
    position: 90,
    accidentGrade: 2,
    isBacktracking: true,
  },
  {
    position: 271,
    accidentGrade: 3,
  },
  {
    position: 15,
    accidentGrade: 4,
  },
  {
    position: 329,
    accidentGrade: 5,
  },
  {
    position: 45,
    accidentGrade: 0,
  },
  {
    position: 135,
    accidentGrade: 1,
  },
  {
    position: 180,
    accidentGrade: 2,
  },
].forEach((base, idx) =>
  mockEntity(`path${idx + 1}`, () => ({
    ...base,
    actions: [
      {
        actionId: "travel",
        label: "Travel",
        actionPoints: 0,
        parameters: [],
      },
    ],
  }))
);
