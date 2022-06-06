import stoneHammerIcon from "../../../../.storybook/mocks/assets/stone-hammer.png";
import barkRopeIcon from "../../../../.storybook/mocks/assets/bark-rope.png";
import boneClubIcon from "../../../../.storybook/mocks/assets/bone-club.png";
import stoneKnifeIcon from "../../../../.storybook/mocks/assets/stone-knife.png";
import sharpStoneIcon from "../../../../.storybook/mocks/assets/sharp-stone.png";
import bruiseIcon from "../../../../.storybook/mocks/assets/bruise.png";
import inventoryIcon from "../../../assets/ui/cartoon/icons/tabs/items.png";
import OperationCraft from "./Craft.vue";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

export default {
  title: "Operations/Craft",
};

const starting = 8;
const startingAP = 18000;
const costAP = 1200;

const crafts = [
  {
    name: "Make Stone Knife",
    craftId: "4ccf1f",
    icon: stoneKnifeIcon,
    produce: [
      { publicId: "d9845f", itemDef: { icon: stoneKnifeIcon }, amount: 1 },
    ],
    materials: [
      { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 1 },
      { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 1 },
    ],
  },
];

const material1 = {
  id: 1,
  publicId: "228441",
  amount: 10,
};
const material2 = {
  id: 2,
  publicId: "1c686b",
  amount: 3,
};
const entities = {
  [material1.id]: material1,
  [material2.id]: material2,
};
const inventory = [material1.id, material2.id];

const rootEntityStream = new Rx.ReplaySubject(1);

let craftsStream = new Rx.ReplaySubject(1);
const factory = (onMounted = () => {}) => () => {
  GameService.mock({
    getEntityStream: (id) => Rx.Observable.of(entities[id]),
    getCraftsStream: () => craftsStream,
    getRootEntityStream: () => rootEntityStream,
  });
  rootEntityStream.next({
    inventory,
    actionPoints: 18000,
    actionPointsMax: 36000,
  });
  craftsStream.next(crafts);

  return {
    data: () => ({
      inventoryIcon,
      operation: {
        type: "CraftOperation",
        files: {
          js: "/api/res/c6574d.js",
          css: null,
          componentName: "OperationCraft",
        },
        context: {
          craftId: "4ccf1f",
          unitCost: costAP,
          tools: ["Hammering"],
          toolsSelected: {
            Hammering: {
              icon: stoneHammerIcon,
              efficiency: 100,
              toolType: "Hammering",
            },
          },
          skillInfo: {
            skill: "Crafting",
            skillGainMult: 4,
            successChance: 2,
            accidentChance: 1,
            accidentSeverity: 2,
          },
        },
      },
    }),

    components: {
      OperationCraft,
    },

    mounted() {
      onMounted(this);
    },

    template: operationWrapper(
      `<OperationCraft :operation="operation" ref="operation" />`
    ),
  };
};

export const base = factory();
export const notEnough = factory((vm) => {
  craftsStream.next([
    {
      ...crafts[0],
      produce: [
        { publicId: "d9845f", itemDef: { icon: boneClubIcon }, amount: 2 },
      ],
      materials: [
        { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 4 },
        { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 22 },
      ],
    },
  ]);
});
export const noToolSelected = factory((vm) => {
  vm.operation.context.toolsSelected = {
    Hammering: {
      toolType: "Hammering",
    },
  };
});
export const noTool = factory((vm) => {
  vm.operation.context.toolsSelected = {};
  vm.operation.context.tools = [];
});
export const multipleTools = factory((vm) => {
  vm.operation.context.toolsSelected = {
    ...vm.operation.context.toolsSelected,
    Cutting: {
      toolType: "Cutting",
    },
  };
  vm.operation.context.tools = ["Hammering", "Cutting"];
});
export const multitudeOfItems = factory((vm) => {
  craftsStream.next([
    {
      ...crafts[0],
      produce: [
        { publicId: "d9845f1", itemDef: { icon: stoneHammerIcon }, amount: 1 },
        { publicId: "d9845f2", itemDef: { icon: boneClubIcon }, amount: 2 },
        { publicId: "d9845f3", itemDef: { icon: stoneKnifeIcon }, amount: 3 },
      ],
      materials: [
        { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 1 },
        { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 2 },
        { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 3 },
        { publicId: "228441", itemDef: { icon: sharpStoneIcon }, amount: 4 },
        { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 1 },
        { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 2 },
        { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 3 },
      ],
    },
  ]);
});
export const withResults = factory((vm) => {
  clearInterval(vm.interval);
  vm.interval = setInterval(() => {
    const results = [
      { d9845f: 1, a3dsw3: { 0: 1, 1: 1 } },
      { d9845f: 1, a3dsw3: { 3: 2 } },
      { d9845f: 0, a3dsw3: { 0: 1 } },
    ];
    const performedAmount = results.length;
    rootEntityStream.next({
      inventory,
      actionPoints: startingAP,
      actionPointsMax: 36000,
    });
    vm.$refs.operation.amount = starting;
    setTimeout(() => {
      clickAndRespond(vm, {
        amount: starting - performedAmount,
        results,
        statusChanges: [
          {
            icon: bruiseIcon,
            text: "Injury",
            subtext: "Bruise",
          },
        ],
      });
      rootEntityStream.next({
        inventory,
        actionPoints: startingAP - costAP * performedAmount,
        actionPointsMax: 36000,
      });
    }, 1000);
  }, 4000);

  craftsStream.next([
    {
      ...crafts[0],
      produce: [
        { publicId: "d9845f", itemDef: { icon: sharpStoneIcon }, amount: 1 },
        { publicId: "a3dsw3", itemDef: { icon: barkRopeIcon }, amount: 2 },
      ],
      materials: [
        { publicId: "228441", itemDef: { icon: stoneHammerIcon }, amount: 1 },
      ],
    },
  ]);
});
