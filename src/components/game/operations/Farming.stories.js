import bruiseIcon from "../../../../.storybook/mocks/assets/bruise.png";
import appleIcon from "../../../../.storybook/mocks/assets/apple.png";
import OperationFarming from "./Farming.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Farming",
};

const factory = (onMounted) =>
  mockComponent(
    {
      data: () => ({
        operation: storyMocks.operations.farming,
      }),

      components: {
        OperationFarming,
      },

      template: operationWrapper(
        `<OperationFarming :operation="operation" ref="operation" />`
      ),
    },
    onMounted,
    () => {
      GameService.mock({
        request: () => Promise.resolve({ ok: true }),
      });
      storyMocks.modifyEntity("mainEntity", {
        inventory: [
          ...entitiesMocks.mainEntity.inventory,
          mockEntityId("itemFloorDecor"),
        ],
      });
    }
  );

export const base = factory();
export const tiny = factory((vm) => {
  storyMocks.modifyEntity("farm", {
    farmSize: [3, 2],
  });
});
export const harvestResult = factory((vm) => {
  storyMocks.modifyEntity("farm", {
    farmSize: [2, 2],
  });
  vm.$refs.operation.harvesting = true;
  vm.$refs.operation.harvestingProcessing = true;
  setTimeout(() => {
    vm.$refs.operation.harvestResult = {
      amount: 450,
      modifiers: {
        ground: 1,
        climate: 3,
        wateringMinus: 2,
        wateringPlus: 2,
        weed: 3,
        vermin: 3,
        plantQuality: 2,
        harvestQuality: 2,
      },
      item: {
        publicId: "c73b6d",
        icon: appleIcon,
        description: "A tiny, red fruit. It has a sharp smell.",
        unitWeight: 0.2,
      },
    };
    vm.$refs.operation.updateHarvestResultAmount();
  });
});
harvestResult.parameters = {
  storyshots: { disable: true },
};
