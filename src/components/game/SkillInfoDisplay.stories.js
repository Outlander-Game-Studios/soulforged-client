export default {
  title: "Game UI/Skill Info Display",
};

export const sample = mockComponent({
  methods: {
    makeOp(successChance, accidentChance, accidentSeverity) {
      return {
        context: {
          skillInfo: {
            skill: "Carpentry",
            successChance,
            accidentChance,
            accidentSeverity,
            skillGainMult: 4,
          },
        },
      };
    },
  },

  template: `
<Container>
  <SkillInfoDisplay :operation="makeOp(5,0,0)" />
  <SkillInfoDisplay :operation="makeOp(4,1,1)" />
  <SkillInfoDisplay :operation="makeOp(3,2,2)" />
  <SkillInfoDisplay :operation="makeOp(2,3,3)" />
  <SkillInfoDisplay :operation="makeOp(1,4,4)" />
  <SkillInfoDisplay :operation="makeOp(0,5,5)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,0,0)" />
  <SkillInfoDisplay :operation="makeOp(1,1,1)" />
  <SkillInfoDisplay :operation="makeOp(2,2,2)" />
  <SkillInfoDisplay :operation="makeOp(3,3,3)" />
  <SkillInfoDisplay :operation="makeOp(4,4,4)" />
  <SkillInfoDisplay :operation="makeOp(5,5,5)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,1,0)" />
  <SkillInfoDisplay :operation="makeOp(0,0,1)" />

</Container>
`,
});
sample.parameters = {
  storyshotsScope: "extended",
};
