import {
  clickAndRespond,
  operationWrapper,
} from "../../../../.storybook/story-utils.js";
import bruiseIcon from "../../../../.storybook/mocks/assets/bruise.png";
import cutIcon from "../../../../.storybook/mocks/assets/cut.png";
import combatIcon from "./icons/combat.png";

import OperationCombat from "./Combat.vue";

const moveDetailedMock = {
  secondary: false,
  moveId: "whack-bdb297b",
  name: "Whack",
  missingReq: false,
  icon: "/api/res/4ac121.jpg",
  cooldown: 0,
  missingReqMessage: null,
  skillLevelRequired: 4,
  cooldownMax: 4,
  isCounter: false,
  triggersCounter: true,
  description:
    'Any hit applies 〚Dazed﹃/api/res/a2eb0e.jpg﹃{"impacts":[{"name":"Hit Rating","value":"-10","good":false},{"name":"Defense Rating","value":"-10","good":false},{"name":"Damage","value":"-1","good":false}]}〛 for 2 turns to your target and removes 1 stack of 〚Focused﹃/api/res/31491c.jpg﹃{"impacts":[{"name":"Hit Rating","value":"+20","good":true}]}〛.',
  details: true,
  skill: "Combat: Mace",
  damage: {
    Blunt: 5,
    Pierce: 1,
  },
  hitRating: 34,
  raw: {
    damage: {
      Blunt: 8,
      Pierce: 4,
    },
    hitRating: 10,
  },
};

const outcomes = [
  {
    text: "Solid hit!",
    type: "good",
    effects: [
      {
        icon: bruiseIcon,
        stacks: 5,
      },
      {
        icon: cutIcon,
        stacks: 2,
      },
      {
        icon: bruiseIcon,
        stacks: 5,
      },
      {
        icon: cutIcon,
        stacks: 2,
      },
      {
        icon: cutIcon,
        durationTurns: 5,
      },
    ],
  },
  {
    text: "Perfect hit!",
    type: "great",
    hitMultiplier: 1,
    effects: [
      {
        icon: bruiseIcon,
        stacks: 5,
      },
    ],
  },
  {
    text: "Glancing hit",
    type: "poor",
    effects: [],
  },
  {
    text: "Miss",
    type: "default",
    effects: [],
  },
  {
    text: "Perfect hit!",
    type: "great",
    effects: [
      {
        icon: bruiseIcon,
        stacks: 5,
      },
    ],
  },
];

export default {
  title: "Operations/Combat",
};

const factory = (
  onCreated = () => {},
  operationMod = {},
  onDestroyed,
  onMounted = () => {}
) =>
  mockComponent(
    {
      data: () => ({
        operation: { ...storyMocks.operations.combat, ...operationMod },
      }),
      template: operationWrapper(
        `<OperationCombat ref="operationComponent" :operation="operation" />`,
        true
      ),
    },
    onMounted,
    () => {
      onCreated();
      storyMocks.modifyEntity("mainEntity", {
        operationInfo: {
          icon: combatIcon,
          name: "In Combat",
        },
      });
      storyMocks.modifyEntity("mob1", {
        operationInfo: {
          icon: combatIcon,
          name: "In Combat",
        },
      });
      storyMocks.operations.start(storyMocks.operations.combat);
    },
    onDestroyed
  );

export const base = factory(() => {
  GameService.mock({
    request: () =>
      Promise.resolve({
        mobExpLevel: 0,
        expProgress: 0,
      }),
  });
  storyMocks.modifyEntity("mob1", {
    effects: [
      ...entitiesMocks.mainEntity.effects,
      ...Array.create(8).map(() => ({
        name: "x",
        icon: bruiseIcon,
        durationTurns: 3,
        stacks: 4,
        impacts: [
          { name: "Hit Rating", value: "+2", good: true },
          { name: "Defense Rating", value: -2, good: false },
          { name: "Damage", value: "+2", good: true },
          { name: "Cut Resistance", value: "+2", good: true },
          { name: "Blunt Resistance", value: "+2", good: true },
          { name: "Pierce Resistance", value: "+2", good: true },
        ],
      })),
    ],
  });
});
export const moveSelected = factory(
  () => {
    GameService.mock({
      getInfoStream: () => Rx.Observable.of(moveDetailedMock),
    });
  },
  {},
  () => {},
  (vm) => {
    setInterval(() => {
      if (vm.$refs.operationComponent) {
        vm.$refs.operationComponent.timeRemaining = 2000;
        clearInterval(vm.$refs.operationComponent.timerInterval);
        vm.$refs.operationComponent.selectedMoveId = "attack2";
      }
    }, 1000);
  }
);
export const enemyDead = factory(() => {
  storyMocks.modifyEntity("mob1", {
    dead: true,
  });
});
export const paused = factory(() => {
  storyMocks.modifyEntity("combat", {
    running: false,
    canResume: false,
  });
});
export const pausedCanResume = factory(() => {
  storyMocks.modifyEntity("combat", {
    running: false,
  });
});
export const fleeing = factory(
  () => {
    storyMocks.modifyEntity("combat", {
      fleeing: {
        [mockEntityId("mainEntity")]: 70,
        [mockEntityId("mob1")]: 20,
      },
    });
  },
  {
    context: { currentMove: "flee" },
  }
);

export const fleeingProgress = factory(
  () => {
    let i = 10;
    setInterval(() => {
      storyMocks.modifyEntity("combat", {
        fleeing: {
          [mockEntityId("mainEntity")]: i,
          [mockEntityId("mob1")]: i + 5,
        },
      });
      i += 5;
      i = i % 110;
    }, 1000);
  },
  {
    context: { currentMove: "flee" },
  }
);
fleeingProgress.parameters = {
  storyshots: { disable: true },
};

export const manyVsMany = factory(() => {
  storyMocks.modifyEntity("combat", {
    creatures: [
      ...Array.create(5).map(() =>
        storyMocks.cloneEntityPayloadId("mainEntity")
      ),
      ...Array.create(100).map(() => storyMocks.cloneEntityPayloadId("mob1")),
    ],
  });
});

let timeouts = [],
  interval;
const PLAYER_TURN = 2000;
export const damageDealt = factory(
  () => {
    storyMocks.modifyEntity("combat", {
      creatures: [
        mockEntityId("mainEntity"),
        mockEntityId("mainEntity2"),
        mockEntityId("mob1"),
      ],
    });
    const makeDamages = (from, to) => {
      const fromEntity = entitiesMocks[from];
      const toEntity = entitiesMocks[to];
      GameService.getCombatFramesStream().next({
        type: COMBAT_FRAMES.APPROACH,
        affects: [fromEntity, toEntity],
        whoId: fromEntity.id,
        targetId: toEntity.id,
      });
      GameService.getCombatFramesStream().next({
        type: COMBAT_FRAMES.STRIKE,
        affects: [fromEntity, toEntity],
        whoId: fromEntity.id,
        targetId: toEntity.id,
        floaties: {
          [toEntity.id]: random.randomItem(outcomes),
        },
      });
      GameService.getCombatFramesStream().next({
        type: COMBAT_FRAMES.STRIKE,
        affects: [fromEntity, toEntity],
        whoId: toEntity.id,
        targetId: fromEntity.id,
        floaties: {
          [fromEntity.id]: random.randomItem(outcomes),
        },
      });
      GameService.getCombatFramesStream().next({
        type: COMBAT_FRAMES.RETURN,
        affects: [fromEntity, toEntity],
        whoId: fromEntity.id,
        targetId: toEntity.id,
      });
    };
    let last = 0;
    const nextMove = (from, to, time) => {
      setTimeout(() => {
        storyMocks.modifyEntity("combat", {
          creatureTurn: mockEntityId(from),
          timeLeft: from === "mainEntity" ? 8000 : undefined,
        });
      }, last + 1000);
      setTimeout(() => makeDamages(from, to), time);
      last = time;
    };
    timeouts.forEach((t) => clearTimeout(t));
    clearInterval(interval);
    timeouts = [];
    const action = () => {
      last = 0;
      timeouts = [
        nextMove("mainEntity", "mob1", PLAYER_TURN + 1000),
        nextMove("mob1", "mainEntity", PLAYER_TURN + 2000),
        nextMove("mainEntity2", "mainEntity", PLAYER_TURN + 5200),
        nextMove("mob1", "mainEntity2", PLAYER_TURN + 7200),
      ];
    };
    interval = setInterval(action, PLAYER_TURN + 9200);
    action();
  },
  {},
  () => {
    timeouts.forEach((t) => clearTimeout(t));
    clearInterval(interval);
  }
);
damageDealt.parameters = {
  storyshots: { disable: true },
};

export const finish = factory(
  () => {
    storyMocks.modifyEntity("combat", {
      started: true,
      finished: true,
      loot: [mockEntityId("itemFood1"), mockEntityId("itemCorpse")],
    });
  },
  {
    finished: true,
  }
);

export const fled = factory(
  () => {
    storyMocks.modifyEntity("combat", {
      started: true,
      finished: true,
      loot: [mockEntityId("itemFood1"), mockEntityId("itemCorpse")],
    });
  },
  {
    finished: true,
    fled: true,
  }
);

export const lost = factory(
  () => {
    storyMocks.modifyEntity("combat", {
      started: true,
      finished: true,
      loot: [mockEntityId("itemFood1"), mockEntityId("itemCorpse")],
    });
  },
  {
    finished: true,
    lost: true,
    fled: true,
  }
);
