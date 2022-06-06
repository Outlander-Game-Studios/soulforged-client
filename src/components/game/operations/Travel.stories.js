import stoneHammerIcon from "../../../../.storybook/mocks/assets/stone-hammer.png";
import bruiseIcon from "../../../../.storybook/mocks/assets/bruise.png";
import OperationTravel from "./Travel.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Travel",
};

const factory = (onMounted = () => {}) => () => {
  GameService.mock({
    getRootEntityStream: () =>
      Rx.Observable.of({
        actionPoints: 18000,
        actionPointsMax: 36000,
      }),
    request: (req) => {
      if (req === REQUEST_CODES.COMMENCE_OPERATION) {
        return Promise.resolve(commenceResult);
      }
    },
  });

  return {
    data: () => ({
      operation: storyMocks.operations.travel,
    }),

    components: {
      OperationTravel,
    },

    mounted() {
      onMounted(this);
    },

    template: operationWrapper(`<OperationTravel :operation="operation" />`),
  };
};

export const base = factory();
export const accident = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.finished = true;
  clickAndRespond(vm, {
    statusChanges: [
      {
        icon: bruiseIcon,
        text: "Injury",
        subtext: "Bruise",
      },
    ],
  });
});
export const requiresTool = factory((vm) => {
  vm.operation = JSON.parse(JSON.stringify(vm.operation));
  vm.operation.context = {
    ...vm.operation.context,
    tools: ["Hammering"],
    toolsSelected: {
      Hammering: {
        icon: stoneHammerIcon,
        efficiency: 100,
        toolType: "Hammering",
      },
    },
  };
});
