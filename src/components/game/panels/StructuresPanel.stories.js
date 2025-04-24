export default {
  title: "Game UI/Structures Panel",
};

export const sample = mockComponent({
  data: () => ({
    structures: [
      mockEntityId("structureNonOperational1"),
      mockEntityId("structureOperational"),
      mockEntityId("structureHome"),
      mockEntityId("shop"),
      mockEntityId("containerUnlooted"),
      mockEntityId("containerLooted"),
    ],
  }),

  template: `
<Container>
  <StructuresPanel :structures="structures" />
</Container>
`,
});
