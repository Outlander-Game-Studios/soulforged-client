export default {
  title: "Game UI/Skill Info Display",
};

export const sample = mockComponent({
  methods: {
    makeOp(successChance, accidentChance, accidentSeverity, finalSpeed = 100) {
      return {
        context: {
          skillInfo: {
            skill: "Carpentry",
            successChance,
            accidentChance,
            accidentSeverity,
            finalSpeed,
            skillLevel: 0,
            skillGainMult: 4,
          },
        },
      };
    },
  },

  template: `
<Container>
<Spaced>
  <SkillInfoDisplay :operation="makeOp(5,0,0, 150)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(4,1,1,100)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(3,2,2,75)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(2,3,3,50)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(1,4,4,30)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,5,5,0)" />
  <hr/>
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,0,0)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(1,1,1)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(2,2,2)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(3,3,3)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(4,4,4)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(5,5,5)" />
  <hr/>
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,1,0)" />
  <hr/>
  <SkillInfoDisplay :operation="makeOp(0,0,1)" />
</Spaced>
</Container>
`,
});
sample.parameters = {
  storyshotsScope: "extended",
};
