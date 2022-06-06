export default {
  title: "Base UI/Borders",
};

const component = (size, type) => `
<BorderRound :size="${size}" borderType="${type}" backgroundType="alt">
  ${size}
</BorderRound>
`;

const factory = (type) => () => ({
  template: `
<Vertical>
  <Horizontal>${component(1, type)}</Horizontal>
  <Horizontal>${component(2, type)}</Horizontal>
  <Horizontal>${component(4, type)}</Horizontal>
  <Horizontal>${component(8, type)}</Horizontal>
  <Horizontal>${component(12, type)}</Horizontal>
  <Horizontal>${component(16, type)}</Horizontal>
</Vertical>
`,
});

export const roundBase = factory("base");
export const roundSecondary = factory("secondary");
export const roundTight = factory("tight");
export const roundTightGlow = factory("tightGlow");
