import stoneHammerIcon from "../../../../.storybook/mocks/assets/stone-hammer.png";
import stoneKnifeIcon from "../../../../.storybook/mocks/assets/stone-knife.png";
import OperationConstruct from "./Construct.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Construct",
};

const factory = (onMounted) =>
  mockComponent(
    {
      data: () => ({
        operation: storyMocks.operations.construct,
      }),

      components: {
        OperationConstruct,
      },

      template: operationWrapper(
        `<OperationConstruct ref="operationComponent" :operation="operation" />`
      ),
    },
    onMounted
  );

export const base = factory();
export const addingMaterial = factory((vm) => {
  vm.$el.querySelector("button").click();
});
export const materialsAdded = factory(() => {
  storyMocks.modifyEntity("structureNonOperational2", {
    materials: [],
  });
});
export const toolsSelected = factory((vm) => {
  storyMocks.modifyEntity("structureNonOperational2", {
    materials: [],
  });
  vm.operation = {
    ...vm.operation,
    context: {
      ...vm.operation.context,
      toolsSelected: {
        Cutting: { efficiency: 80, toolType: "Cutting", icon: stoneKnifeIcon },
        Hammering: {
          efficiency: 80,
          toolType: "Hammering",
          icon: stoneHammerIcon,
        },
      },
    },
  };
});
export const withProgress = factory((vm) => {
  storyMocks.modifyEntity("structureNonOperational2", {
    materials: [],
    constructionProgress: 20,
  });
});
export const selectWorkAmount = factory((vm) => {
  storyMocks.modifyEntity("structureNonOperational2", {
    materials: [],
    constructionProgress: 20,
  });
  vm.$refs.operationComponent.workAmount = 30;
});
export const completed = factory(() => {
  storyMocks.modifyEntity("structureNonOperational2", {
    materials: [],
    operational: true,
  });
});
