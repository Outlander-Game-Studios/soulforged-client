import wolfIcon from "../../../../.storybook/mocks/assets/wolf.png";
import anvilIcon from "../../../../.storybook/mocks/assets/anvil.png";
import avatarIcon from "../../../../.storybook/mocks/assets/avatar.png";
import moodUpIcon from "../../../../.storybook/mocks/assets/mood_up.png";
import combatIcon from "./icons/combat.png";
import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";

import OperationEncounter from "./Encounter.vue";

const entities = {
  "E::1::none": {
    creatures: ["E::103::see", "E::96::see"],
  },
  "E::103::see": {
    icon: avatarIcon,
    effects: [
      {
        name: "Mood: Content",
        icon: moodUpIcon,
        severity: 0,
        impacts: [],
      },
      {
        name: "Overburdened",
        icon: anvilIcon,
        severity: 3,
        impacts: [{ name: "Travel speed", value: 0, good: false }],
      },
    ],
    id: 103,
    actions: [],
    name: "Bobby",
    combatStats: {
      armor: [
        {
          label: "Blunt Resistance",
          value: 2.5,
        },
      ],
    },
  },
  "E::96::see": {
    name: "Wolf",
    icon: wolfIcon,
    effects: [
      {
        name: "Mood: Content",
        icon: moodUpIcon,
        severity: 0,
        impacts: [],
      },
    ],
    hostile: true,
    id: 96,
    actions: [
      {
        actionId: "approach",
        label: "Assault",
        actionPoints: 0,
        parameters: [],
      },
    ],
  },
  "E::996::see": {
    icon: wolfIcon,
    effects: [
      {
        name: "Mood: Content",
        icon: moodUpIcon,
        severity: 0,
        impacts: [],
      },
    ],
    hostile: false,
    id: 96,
    actions: [
      {
        actionId: "approach",
        label: "Assault",
        actionPoints: 0,
        parameters: [],
      },
    ],
  },
};

export default {
  title: "Operations/Encounter",
};

const factory = (onMounted = () => {}, onInit = () => {}) => () => {
  GameService.mock({
    checkQuickActions: () => {},
    getEntityStream: (id) => Rx.Observable.of(entities[id]),
    getRootEntityStream: () =>
      Rx.Observable.of({
        ...entities["E::103::see"],
        actionPoints: 18000,
        actionPointsMax: 36000,
      }),
  });

  onInit();

  return {
    data: () => ({
      operation: {
        type: "EncounterOperation",
        context: {
          combatEngagement: "E::1::none",
          hasAliveHostiles: true,
          canAttack: true,
          canBackAway: true,
          friendly: ["E::103::see"],
          hostile: ["E::96::see"],
        },
      },
    }),

    components: {
      OperationEncounter,
    },

    mounted() {
      onMounted(this);
    },

    template: operationWrapper(`<OperationEncounter :operation="operation" />`),
  };
};

export const base = factory(
  () => {},
  () => {
    const localEntities = { ...entities };
    GameService.mock({
      getEntityStream: (id) => Rx.Observable.of(localEntities[id]),
    });
  }
);
export const oneVsMany = factory(
  () => {},
  () => {
    const localEntities = {
      ...entities,
      "E::1::none": {
        creatures: ["E::103::see", ...Array.create(20).map(() => "E::96::see")],
      },
    };
    GameService.mock({
      getEntityStream: (id) => Rx.Observable.of(localEntities[id]),
    });
  }
);
export const manyVsMany = factory(
  () => {},
  () => {
    const localEntities = {
      ...entities,
      "E::1::none": {
        creatures: [
          ...Array.create(10).map(() => "E::103::see"),
          ...Array.create(10).map(() => "E::996::see"),
          ...Array.create(20).map(() => "E::96::see"),
        ],
      },
    };
    GameService.mock({
      getEntityStream: (id) => Rx.Observable.of(localEntities[id]),
    });
  }
);
export const creatureInitiated = factory((vm) => {
  vm.operation.context.canBackAway = false;
});
export const startedByAnother = factory((vm) => {
  vm.operation.context.canAttack = false;
});
export const hostileInCombat = factory(
  (vm) => {
    vm.operation.context.canAttack = false;
  },
  () => {
    const localEntities = {
      ...entities,
      "E::96::see": {
        ...entities["E::96::see"],
        operationInfo: {
          icon: combatIcon,
          name: "In Combat",
        },
      },
    };
    GameService.mock({
      getEntityStream: (id) => Rx.Observable.of(localEntities[id]),
    });
  }
);
export const noLiveHostiles = factory(
  (vm) => {
    vm.operation.context.hasAliveHostiles = false;
  },
  () => {
    const localEntities = {
      ...entities,
      "E::96::see": {
        ...entities["E::96::see"],
        dead: true,
      },
    };
    GameService.mock({
      getEntityStream: (id) => Rx.Observable.of(localEntities[id]),
    });
  }
);
