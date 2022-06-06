import stoneHammerIcon from "../../../.storybook/mocks/assets/stone-hammer.png";
import sampleIcon from "../../../.storybook/mocks/assets/mood_up.png";

export default {
  title: "Base UI/Icons",
};

const icon = (size, icon, borderType, round = false, text) =>
  `
<Icon
  size="${size}"
  src="${icon}"
  :round="${round}"
  borderType="${borderType}"
  :text='${JSON.stringify(text)}'
/>`;
const iconGroup = (size) => `
<HorizontalWrap>
  ${icon(size, stoneHammerIcon, "base")}
  ${icon(size, sampleIcon, "base")}
  ${icon(size, stoneHammerIcon, "alt")}
  ${icon(size, sampleIcon, "alt")}
</HorizontalWrap>
<HorizontalWrap>
  ${icon(size, stoneHammerIcon, "base", false, { bottomRight: 5 })}
  ${icon(size, sampleIcon, "base", false, { bottomRight: 5 })}
  ${icon(size, stoneHammerIcon, "alt", false, { bottomRight: 5 })}
  ${icon(size, sampleIcon, "alt", false, { bottomRight: 5 })}
</HorizontalWrap>
<HorizontalWrap>
  ${icon(size, stoneHammerIcon, "base", true)}
  ${icon(size, sampleIcon, "base", true)}
  ${icon(size, stoneHammerIcon, "tight", true)}
  ${icon(size, sampleIcon, "tightGlow", true)}
</HorizontalWrap>
`;

export const icons = () => ({
  template: `
<div>
  <Vertical>
    ${iconGroup(4)}
    ${iconGroup(8)}
    ${iconGroup(12)}
    ${iconGroup(16)}
  </Vertical>
</div>  
`,
});
