export default {
  title: "Game UI/Status",
};

export const sample = mockComponent(
  {
    template: `
<div>
  <Status />
</div>
`,
  },
  () => {},
  () => {
    GameService.mock({
      request: () => new Promise(() => {}),
    });
  }
);
