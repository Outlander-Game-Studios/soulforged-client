import "./Location.vue";

export default {
  title: "Game UI/Location",
};

export const base = mockComponent({
  template: `
<div :style="{ overflow: 'hidden' }">
  <Location />
</div>
  `,
});

export const imageLoading = mockComponent(
  {
    template: `
<div :style="{ overflow: 'hidden' }">
  <Location />
</div>
  `,
  },
  () =>
    GameService.mock({
      getLocationImgPath: () => null,
    })
);
