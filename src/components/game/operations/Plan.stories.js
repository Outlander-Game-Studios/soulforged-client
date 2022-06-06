import tentIcon from "../../../../.storybook/mocks/assets/tent.jpg";
import sampleMapImage from "../../../../.storybook/mocks/assets/map.jpg";
import OperationPlan from "./Plan.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Plan",
};

const IDS = {
  location: 36,
  mainEntity: 329,
};
const paths = [
  {
    position: 216,
    id: 230,
    accidentGrade: 0,
    actions: [
      { actionId: "travel", label: "Travel", actionPoints: 0, parameters: [] },
    ],
  },
  {
    position: 90,
    id: 2302,
    accidentGrade: 2,
    actions: [
      { actionId: "travel", label: "Travel", actionPoints: 0, parameters: [] },
    ],
  },
  {
    position: 271,
    id: 231,
    accidentGrade: 3,
    actions: [
      {
        actionId: "travel",
        label: "Backtrack",
        actionPoints: 0,
        parameters: [],
      },
    ],
  },
  {
    position: 15,
    id: 232,
    accidentGrade: 4,
    actions: [
      { actionId: "travel", label: "Travel", actionPoints: 0, parameters: [] },
    ],
  },
  {
    position: 329,
    id: 283,
    accidentGrade: 5,
    actions: [
      { actionId: "travel", label: "Travel", actionPoints: 0, parameters: [] },
    ],
  },
];
const location = {
  paths: paths.map((p) => p.id),
  creatures: [],
  resources: [],
  inventory: [],
  structures: [],
  id: IDS.location,
  actions: [],
};
const mainEntity = {
  id: IDS.mainEntity,
  actions: [],
  location: IDS.location,
  effects: [],
  actionPoints: 57600 / 3,
  actionPointsMax: 57600,
  inventory: [IDS.item2],
  crafts: [],
  plans: [],
  equipment: {},
  dead: false,
  name: "Bobby",
};
const entities = {
  ...paths.toObject((p) => p.id),
  [IDS.location]: location,
  [IDS.mainEntity]: mainEntity,
};
const plans = [
  {
    planId: "dacb6e",
    name: "Tent",
    icon: tentIcon,
  },
  {
    planId: "dacb62",
    name: "Tent Road",
    icon: tentIcon,
  },
];

const factory = (onMounted = () => {}) => () => {
  GameService.mock({
    getPlansStream: () => Rx.Observable.of(plans),
    getEntityStream: (id) => Rx.Observable.of(entities[id]),
    getRootEntityStream: () => Rx.Observable.of(mainEntity),
    getLocationImgPath: () => sampleMapImage,
  });

  return {
    data: () => ({
      operation: {
        type: "PlanOperation",
        context: {
          planId: "dacb6e",
          pathPlacement: false,
          spacing: {
            required: "Tight",
            available: "Tight",
            fits: true,
          },
        },
      },
    }),

    components: {
      OperationPlan,
    },

    mounted() {
      onMounted(this);
    },

    template: operationWrapper(`<OperationPlan :operation="operation" />`),
  };
};

export const base = factory();
export const noSpacing = factory((vm) => {
  vm.operation.context.spacing = {
    required: "Tight",
    available: "Very Tight",
    fits: false,
  };
});
export const road = factory((vm) => {
  vm.operation.context.planId = "dacb62";
  vm.operation.context.pathPlacement = true;
});
