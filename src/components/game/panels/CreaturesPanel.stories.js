export default {
  title: "Game UI/Creatures Panel",
};

export const sample = mockComponent({
  data: () => ({
    creatures: [
      mockEntityId("mainEntity"),
      mockEntityId("mob1"),
      mockEntityId("mob1"),
    ],
  }),

  template: `
<Container>
  <CreaturesPanel :creatures="creatures" />
</Container>
`,
});
