import OperationDialogue from "./Dialogue.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Dialogue",
};

const factory = (onMounted) =>
  mockComponent(
    {
      data: () => ({
        operation: storyMocks.operations.dialogue,
      }),

      components: {
        OperationDialogue,
      },

      template: operationWrapper(
        `<OperationDialogue :operation="operation" />`
      ),
    },
    onMounted
  );

export const base = factory();
export const start = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.context.history = [operationsMocks.dialogue.context.history[0]];
});
export const long = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.context.history = [
    ...operationsMocks.dialogue.context.history,
    ...operationsMocks.dialogue.context.history,
    ...operationsMocks.dialogue.context.history,
    ...operationsMocks.dialogue.context.history,
    ...operationsMocks.dialogue.context.history,
  ];
});
export const fewOptions = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.context.options = {
    "4a2028": "What are you?",
  };
});
export const noOptions = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.context.options = {};
});
