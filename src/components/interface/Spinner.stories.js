export default {
  title: "Base UI/Spinner",
};

export const base = () => ({
  template: `
<div>
  <Vertical>
    <Spinner :size="1.5" />
    <Spinner :size="3" />
    <Spinner :size="5.6" />
    <Spinner :size="10" />
  </Vertical>
</div>
`,
});
base.parameters = {
  storyshots: { disable: true },
};

export const centeredOverlay = () => ({
  template: `
<div>
  <Vertical>
    <Spinner centered :size="1.5" />
    <Spinner centered :size="3" />
    <Spinner centered :size="5.6" />
    <Spinner centered :size="10" />
  </Vertical>
</div>
`,
});
centeredOverlay.parameters = {
  storyshots: { disable: true },
};

export const multitude = () => ({
  template: `
<div>
  <HorizontalWrap>
    <Spinner color="#964500" v-for="index in 500" :key="index" :size="1.5" />
  </HorizontalWrap>
</div>
`,
});
multitude.parameters = {
  storyshots: { disable: true },
};
