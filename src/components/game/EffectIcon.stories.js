import sampleIcon from "../../../.storybook/mocks/assets/mood_up.png";

export default {
  title: "Game UI/Effects Icon",
};

const factory = (severity) =>
  `<EffectIcon :effect="{ icon: '${sampleIcon}', severity: ${severity} }" />`;

export const icons = () => ({
  template: `
<HorizontalWrap>
   ${factory(0)}
   ${factory(1)}
   ${factory(2)}
   ${factory(3)}
   ${factory(4)}
</HorizontalWrap>
`,
});
