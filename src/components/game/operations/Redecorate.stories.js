import bruiseIcon from "../../../../.storybook/mocks/assets/bruise.png";
import OperationRedecorate from "./Redecorate.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Redecorate",
};

const factory = (onMounted) =>
  mockComponent(
    {
      data: () => ({
        operation: storyMocks.operations.redecorate,
      }),

      components: {
        OperationRedecorate,
      },

      template: operationWrapper(
        `<OperationRedecorate :operation="operation" />`
      ),
    },
    onMounted,
    () => {
      storyMocks.modifyEntity("mainEntity", {
        inventory: [
          ...entitiesMocks.mainEntity.inventory,
          mockEntityId("itemFloorDecor"),
        ],
      });
    }
  );

export const base = factory();
export const selectItem = factory((vm) => {
  const interval = setInterval(() => {
    const buttons = vm.$el.querySelectorAll("button");
    if (!buttons) {
      clearInterval(interval);
    } else {
      buttons[1].click();
    }
  }, 10);
});
