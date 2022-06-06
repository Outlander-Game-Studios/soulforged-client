export default {
  title: "Game UI/Effects",
};

export const effectsRow = () => ({
  data: () => ({ effects: Object.values(storyMocks.effects) }),

  template: `
<Container>
  <Effects row :effects="effects" />
</Container>
`,
});

export const effectsList = () => ({
  data: () => ({ effects: Object.values(storyMocks.effects) }),

  template: `
<Container>
  <Effects :effects="effects" />
</Container>
`,
});
