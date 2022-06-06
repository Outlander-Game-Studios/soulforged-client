export default {
  title: "Game UI/Item",
};

const factory = (itemFn = () => {}, showDetails = true) =>
  mockComponent(
    {
      data: () => ({
        item: itemFn(),
      }),

      template: `
<Container>
  <Item :data="item" ref="item" />
</Container>
`,
    },
    (vm) => {
      if (!showDetails) {
        return;
      }
      vm.$refs.item.showDetails = true;
      const interval = setInterval(() => {
        if (!vm.$refs.item) {
          clearInterval(interval);
          return;
        }
        if (!vm.$refs.item.showDetails) {
          vm.$refs.item.showDetails = true;
        }
      }, 10);
    }
  );

export const icon = factory(() => entitiesMocks.itemMaterial, false);
export const details = factory(() => entitiesMocks.itemMaterial);
export const detailsFood = factory(() => entitiesMocks.itemFood1);
export const detailsTool = factory(() => entitiesMocks.itemTool);
export const detailsWeapon = factory(() => entitiesMocks.itemWeapon);
export const detailsToolWeapon = factory(() => entitiesMocks.itemToolWeapon);
export const detailsDecor = factory(() => entitiesMocks.itemFloorDecor);
