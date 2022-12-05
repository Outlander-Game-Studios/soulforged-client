import Main from "../../views/Main.vue";
import combatEffectIcon from "../../../.storybook/mocks/assets/combat-effect.png";
import bruiseIcon from "../../../.storybook/mocks/assets/bruise.png";
import cutIcon from "../../../.storybook/mocks/assets/cut.png";
import combatIcon from "../../../.storybook/mocks/assets/combat.png";
import Vue from "vue";
import { effects } from "../../../.storybook/mocks/@effects";
import { dungeonAssets } from "../../../.storybook/mocks/@dungeon";
import { GameService } from "../../services/game";

Vue.component("OperationEncounter", window.OperationEncounter);
Vue.component("OperationGather", window.OperationGather);
Vue.component("OperationTravel", window.OperationTravel);
Vue.component("OperationCombat", window.OperationCombat);

export default {
  title: "Game UI/Page Layout",
};

const factory = (onMounted = () => {}, onCreate = () => {}) =>
  mockComponent(
    {
      components: {
        Main,
      },

      mounted() {
        onMounted(this);
      },

      template: `
<Main />
`,
    },
    onMounted,
    () => {
      ControlsService.setCurrentOpenTab(null);
      GameService.mock({
        request: () => new Promise(() => {}),
      });
      storyMocks.modifyEntity("location", {
        creatures: [
          mockEntityId("mainEntity2"),
          mockEntityId("mainEntity"),
          mockEntityId("mob1"),
          mockEntityId("mob1"),
        ],
      });
      onCreate();
    }
  );

const TABS = {
  location: 0,
  inventory: 1,
  character: 2,
  chat: 5,
  trade: 6,
};

export const outline = mockComponent(
  {
    template: `
<PageLayout>
  <template v-slot:overlay>
    Overlay
  </template>
  <template v-slot:status>
    Status
  </template>
  <template v-slot:main>
    Main
  </template>
  <template v-slot:controls>
    Controls
  </template>
</PageLayout>
`,
  },
  () => {},
  () => {
    GameService.mock({
      request: () => new Promise(() => {}),
    });
  }
);

export const loading = factory(
  () => {},
  () => {
    GameService.mock({
      request: () => new Promise(() => {}),
      getRootEntityStream: () => Rx.Observable.empty(),
      getEntityStream: () => Rx.Observable.empty(),
      getLocationStream: () => Rx.Observable.empty(),
    });
  }
);
loading.parameters = {
  storyshotsScope: "medium",
};

export const sample = factory();
sample.parameters = {
  storyshotsScope: "medium",
};

export const seeEffects = factory((vm) => {
  setTimeout(() => {
    vm.$el
      .querySelectorAll(".info-container .effects-container")
      [TABS.location].click();
  });
});

export const locationInfo = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
  });
});
locationInfo.parameters = {
  storyshotsScope: "medium",
};

export const locationCreature = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
    setTimeout(() => {
      vm.$el.querySelector(".creature-icon-wrapper.interactive").click();
    });
  });
});
export const locationListCreatures = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
    setTimeout(() => {
      vm.$el.querySelectorAll(".header-component.interactive")[0].click();
    });
  });
});
export const locationListResources = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
    setTimeout(() => {
      vm.$el.querySelectorAll(".header-component.interactive")[1].click();
    });
  });
});
export const locationListStructures = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
    setTimeout(() => {
      vm.$el.querySelectorAll(".header-component.interactive")[2].click();
    });
  });
});
export const locationStructure = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.location].click();
    setTimeout(() => {
      vm.$el.querySelectorAll(".structure-icon")[0].click();
    });
  });
});

export const inventoryInfo = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.inventory].click();
  });
});
inventoryInfo.parameters = {
  storyshotsScope: "medium",
};

export const characterInfo = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.character].click();
  });
});
characterInfo.parameters = {
  storyshotsScope: "medium",
};

export const tradePanel = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.trade].click();
  });
});
tradePanel.parameters = {
  storyshotsScope: "medium",
};

export const chatPanel = factory((vm) => {
  setTimeout(() => {
    vm.$el.querySelectorAll(".tab-header")[TABS.chat].click();
  });
});
chatPanel.parameters = {
  storyshotsScope: "medium",
};

export const chatPanelFull = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelectorAll(".tab-header")[TABS.chat].click();
    });
  },
  () => {
    storyMocks.chatMocks = [
      {
        whoId: mockEntityId("mainEntity"),
        emo: ":)",
        when: new Date("2021-02-15 12:55:12").getTime(),
        msg: loremIpsum,
      },
    ];
  }
);
chatPanel.parameters = {
  storyshotsScope: "medium",
};

export const encounterOperation = factory(
  () => {},
  () => {
    storyMocks.operations.start(storyMocks.operations.encounter);
  }
);
encounterOperation.parameters = {
  storyshotsScope: "medium",
};

export const gatherOperation = factory(
  () => {},
  () => {
    storyMocks.operations.start(storyMocks.operations.gather);
  }
);
gatherOperation.parameters = {
  storyshotsScope: "medium",
};

export const travelOperation = factory(
  () => {},
  () => {
    storyMocks.operations.start(storyMocks.operations.travel);
  }
);
travelOperation.parameters = {
  storyshotsScope: "extended",
};

const outcomes = [
  [
    {
      type: ATTACK_OUTCOMES.HIT,
      effects: [
        {
          icon: bruiseIcon,
          stacks: 2,
        },
        {
          icon: combatEffectIcon,
          durationTurns: 3,
        },
      ],
    },
  ],
  [
    {
      type: ATTACK_OUTCOMES.HIT,
      effects: [
        {
          icon: bruiseIcon,
          stacks: 5,
        },
        {
          icon: cutIcon,
          stacks: 2,
        },
      ],
    },
  ],
  [
    {
      type: ATTACK_OUTCOMES.HIT,
      effects: [],
    },
  ],
  [
    {
      type: ATTACK_OUTCOMES.MISS,
      effects: [],
    },
  ],
];
let timeouts = [];
let interval;
export const combatOperation = factory(
  () => {},
  () => {
    storyMocks.operations.start(storyMocks.operations.combat);
    storyMocks.modifyEntity("mainEntity", {
      effects: [
        {
          name: "Stunned",
          icon: combatEffectIcon,
          durationTurns: 2,
          severity: 3,
          order: 2,
        },
        ...entitiesMocks.mainEntity.effects,
      ],
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
  }
);
combatOperation.parameters = {
  storyshotsScope: "extended",
};
export const combatOperationAnimated = factory(
  () => {},
  () => {
    storyMocks.operations.start(storyMocks.operations.combat);
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

    storyMocks.modifyEntity("combat", {
      creatures: [
        mockEntityId("mainEntity"),
        mockEntityId("mainEntity2"),
        mockEntityId("mob1"),
      ],
    });
    let damagesId = 0;
    const makeDamages = (from, to) => {
      damagesId++;
      storyMocks.modifyEntity("combat", {
        damages: {
          damagesId: damagesId,
          attackerId: entitiesMocks[from].id,
          defenderId: entitiesMocks[to].id,
          attackerDamageDealt: random.randomItem(outcomes),
          defenderDamageDealt: random.randomItem(outcomes),
        },
      });
    };
    timeouts.forEach((t) => clearTimeout(t));
    clearInterval(interval);
    timeouts = [];
    const base = 300;
    const action = () => {
      timeouts = [
        setTimeout(() => makeDamages("mainEntity", "mob1"), 1 * base),
        setTimeout(() => makeDamages("mob1", "mainEntity"), 3 * base),
        setTimeout(() => makeDamages("mainEntity2", "mainEntity"), 5 * base),
        setTimeout(() => makeDamages("mob1", "mainEntity2"), 7 * base),
      ];
    };
    interval = setInterval(action, 8 * base);
    action();
  }
);
combatOperationAnimated.parameters = {
  storyshots: { disable: true },
};

export const helpDialog = factory((vm) => {
  setTimeout(() => {
    document.querySelector(".help-trigger .help-button").click();
  });
});

export const helpDialogInterface = factory((vm) => {
  setTimeout(() => {
    document.querySelector(".help-trigger .help-button").click();
    setTimeout(() => {
      document.querySelectorAll(".modal button")[0].click();
    });
  });
});

const setupDungeon = () => {
  storyMocks.modifyEntity("location", {
    indoors: true,
    paths: [mockEntityId("path2"), mockEntityId("path3")],
    dungeon: {
      assets: {
        ...storyMocks.dungeonAssets,
        wallLeft: null,
      },
    },
  });
  storyMocks.modifyEntity("path1", {
    position: 180,
    accidentGrade: 1,
  });
  storyMocks.modifyEntity("path2", {
    position: 0,
    accidentGrade: 1,
  });
  storyMocks.modifyEntity("path3", {
    position: 120,
    accidentGrade: 1,
  });
  LocalStorageService.mock({
    getItem: (itemKey) => (itemKey === "HideHelpIndicator" ? 2 : undefined),
  });
  GameService.mock({
    getBackdropStyleStream: () => Rx.Observable.of(null),
  });
};
export const dungeon = factory(
  () => {},
  () => {
    setupDungeon();
  }
);
chatPanel.parameters = {
  storyshotsScope: "extended",
};

export const dungeonWithPanel = factory(
  (vm) => {
    setTimeout(() => {
      vm.$el.querySelectorAll(".tab-header")[TABS.inventory].click();
    });
  },
  () => {
    setupDungeon();
  }
);
chatPanel.parameters = {
  storyshotsScope: "extended",
};
