mockEntity("combat", () => ({
  actions: [],
  yourTurn: true,
  started: true,
  finished: false,
  running: true,
  canResume: true,
  creatureTurn: mockEntityId("mainEntity"),
  benchedCreatures: [],
  disconnectedCharacters: [],
  fleeing: {
    [mockEntityId("mainEntity")]: 0,
    [mockEntityId("mob1")]: 0,
  },
  creatures: [mockEntityId("mainEntity"), mockEntityId("mob1")],
}));
