import stoneHammerIcon from "./assets/stone-hammer.png";

export const operations = {
  craft: {
    type: "CraftOperation",
    context: {
      craftId: "4ccf1f",
      unitCost: 1200,
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
        skillLevel: 0,
        skillGainMult: 4,
        successChance: 2,
        accidentChance: 1,
        accidentSeverity: 2,
      },
    },
  },
  encounter: {
    type: "EncounterOperation",
    files: {
      componentName: "OperationEncounter",
    },
    context: {
      hasAliveHostiles: true,
      canAttack: true,
      canBackAway: true,
      combatEngagement: mockEntityId("combat"),
    },
  },
  combat: {
    type: "CombatOperation",
    files: {
      componentName: "OperationCombat",
    },
    combatEngagement: mockEntityId("combat"),
    context: {
      currentMoveId: "attack",
      currentTarget: mockEntityId("mob1"),
    },
  },
  travel: {
    type: "TravelOperation",
    files: {
      componentName: "OperationTravel",
    },
    context: {
      mapCentered: true,
      pathId: entitiesMocks.path4.id,
      unitCost: 2332,
      skillInfo: {
        skill: "Pathfinding",
        skillLevel: 0,
        skillGainMult: 2,
        accidentChance: 2,
        accidentSeverity: 3,
      },
      tools: [],
      toolsSelected: {},
    },
  },
  construct: {
    type: "ConstructOperation",
    context: {
      buildingId: mockEntityId("structureNonOperational2"),
      unitCost: 70,
      tools: ["Cutting", "Hammering"],
      toolsSelected: {
        Cutting: { efficiency: 0, toolType: "Cutting" },
        Hammering: { efficiency: 0, toolType: "Hammering" },
      },
      skillInfo: {
        baseSpeed: 100,
        finalSpeed: 100,
        speedModifiers: {
          Efficiency: 100,
          Attributes: 100,
        },
      },
    },
  },
  gather: {
    type: "GatherOperation",
    files: {
      componentName: "OperationGather",
    },
    context: {
      resource: mockEntityId("resource1"),
      unitCost: null,
      tools: ["Hunting"],
      toolsSelected: { Hunting: { efficiency: 0, toolType: "Hunting" } },
      skillInfo: {
        skill: "Hunting",
        skillLevel: 0,
        skillGainMult: 1,
        successChance: 1,
        accidentChance: 4,
        accidentSeverity: 1,
      },
    },
  },
  redecorate: {
    type: "RedecorateOperation",
    files: {
      componentName: "OperationRedecorate",
    },
    context: {
      home: mockEntityId("structureHome"),
      decor: {
        1: mockEntityId("itemFloorDecor"),
      },
    },
  },
  shopEdit: {
    type: "ShopEditOperation",
    files: {
      componentName: "OperationShopEdit",
    },
    context: {
      shop: mockEntityId("shop"),
    },
  },
  browseShop: {
    type: "BrowseShopOperation",
    files: {
      componentName: "OperationBrowseShop",
    },
    context: {
      shop: mockEntityId("shop"),
    },
  },
  farming: {
    type: "FarmingOperation",
    files: {
      componentName: "OperationFarming",
    },
    context: {
      farmId: mockEntityId("farm"),
      tools: ["Hammering"],
      action: -1,
      toolsSelected: {
        Hammering: {},
      },
    },
  },
  viewRoadsign: {
    type: "ViewRoadsignOperation",
    files: {
      componentName: "OperationViewRoadsign",
    },
    context: {
      mapCentered: true,
      sign: mockEntityId("structureOperational"),
      labels: {
        [mockEntityId("path1")]: "",
        [mockEntityId("path2")]: "",
        [mockEntityId("path3")]: "",
        [mockEntityId("path4")]: "The Hub",
        [mockEntityId("path5")]: "Mirelands",
        [mockEntityId("path6")]: "",
        [mockEntityId("path7")]: "",
        [mockEntityId("path8")]: "",
      },
    },
  },
  dialogue: {
    type: "",
    file: {
      componentName: "OperationDialogue",
    },
    context: {
      history: [
        {
          text:
            "Hi Bob! This is a very long message. This is a very long message. This is a very long message. This is a very long message. This is a very long message.",
          type: "say",
          who: mockEntityId("mainEntity2"),
        },
        {
          text: "Who are you?",
          type: "say",
          who: mockEntityId("mainEntity"),
        },
        {
          text: "Nobody!",
          type: "say",
          who: mockEntityId("mainEntity2"),
        },
      ],
      options: {
        "4a2028": "What are you?",
        "23425s": "Where are you?",
        "12asdd": "Who are you?",
      },
      with: mockEntityId("mainEntity2"),
    },
  },

  start: (operation) => {
    storyMocks.modifyEntity("mainEntity", {
      operation,
    });
  },
};
global.operationsMocks = operations;
