import { allItemVarieties } from "../../../../.storybook/mocks/@item.js";

export default {
  title: "Game UI/Inventory",
};

const factory = (onMounted, makeInventory) =>
  mockComponent(
    {
      data: () => ({
        inventory: makeInventory
          ? makeInventory()
          : entitiesMocks.mainEntity.inventory.map(
              (id) => entitiesMocks[idToIdentifier[id]]
            ),
      }),

      template: `
<Container>
  <Inventory :inventory="inventory" />
</Container>
`,
    },
    onMounted
  );

export const loading = factory(undefined, () => undefined);

export const empty = factory(undefined, () => []);

export const sample = factory();

export const itemDetails = factory((vm) => {
  const thirdItem = vm.$el.querySelectorAll(".item .icon-wrapper")[3];
  thirdItem.click();
});

export const dropItem = factory((vm) => {
  const thirdItem = vm.$el.querySelectorAll(".item .icon-wrapper")[2];
  thirdItem.click();
  setTimeout(() => {
    const dropButton = document.querySelector(".modal button");
    dropButton.click();
  });
});

export const allVarieties = mockComponent({
  data: () => ({
    inventory: allItemVarieties.map((collection) =>
      collection.map((key) => entitiesMocks[key])
    ),
  }),

  template: `
<Container>
  <Inventory :inventory="inventory[0]" />
  <Inventory :inventory="inventory[1]" />
  <Inventory :inventory="inventory[2]" />
  <Inventory :inventory="inventory[3]" />
</Container>
`,
});
