export default {
  title: "Utils/Storyshots detection",
};

export const storyshotsDetected = () => ({
  data: () => ({ isStoryshots: ControlsService.isStoryshots() }),

  template: `
<h1>
  <center>
    Is storyshots: {{isStoryshots}}
  </center>
</h1>
`,
});
