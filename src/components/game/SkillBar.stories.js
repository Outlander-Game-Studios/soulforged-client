export default {
  title: "Game UI/Skill Bar",
};

export const sample = mockComponent({
  template: `
<Container>
  <SkillBar skillName="Sample skill" :skillLevel="0" />
  <SkillBar skillName="Sample skill" :skillLevel="-1" />
  <SkillBar skillName="Sample skill" :skillLevel="-1.5" />
  <SkillBar skillName="Sample skill" :skillLevel="-1.2" />
  <SkillBar skillName="Sample skill" :skillLevel="-0.8" />
  <SkillBar skillName="Sample skill" :skillLevel="-1.999" />
  <SkillBar skillName="Sample skill" :skillLevel="1" />
  <SkillBar skillName="Sample skill" :skillLevel="1.25" />
  <SkillBar skillName="Sample skill" :skillLevel="1.8" />
  <SkillBar skillName="Sample skill" :skillLevel="20.999" />
</Container>
`,
});
sample.parameters = {
  storyshotsScope: "extended",
};

export const dynamic = mockComponent({
  data: () => ({
    value: -4,
  }),

  created() {
    setInterval(() => {
      this.value += 0.01;
      if (this.value > 4) {
        this.value = -4;
      }
    }, 30);
  },

  template: `
<Container>
  <SkillBar skillName="Sample skill" :skillLevel="value" />
</Container>
`,
});
dynamic.parameters = {
  storyshots: { disable: true },
};
