import tentIcon from "./assets/tent.jpg";
import pebbleIcon from "./assets/pebble.png";
import barkRopeIcon from "./assets/bark-rope.png";
import stoneHammerIcon from "./assets/stone-hammer.png";
import appleIcon from "./assets/apple.png";
import "./@utils.js";

const constructAction = {
  actionId: "construct",
  label: "Construct",
  actionPoints: 0,
  parameters: [],
};
const abandonAction = {
  actionId: "abandon",
  label: "Abandon",
  actionPoints: 0,
  parameters: [],
};

mockEntity("structureNonOperational1", () => ({
  icon: tentIcon,
  name: "{code:1:Tent} (Bobby)",
  materials: [],
  constructionProgress: 30,
  operational: false,
  condition: 0,
  own: true,
  toolEfficiency: {
    Hammering: 100,
  },
  actions: [abandonAction, constructAction],
}));
mockEntity("structureNonOperational2", () => ({
  icon: tentIcon,
  name: "{code:1:Tent} (Joe)",
  materials: [
    { publicId: "3a1160", itemDef: { icon: pebbleIcon }, amount: 30 },
    { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 30 },
  ],
  constructionProgress: 0,
  operational: false,
  condition: 2,
  toolEfficiency: {
    Hammering: 100,
  },
  actions: [constructAction],
}));
mockEntity("structureOperational", () => ({
  icon: tentIcon,
  name: "{code:1:Tent} (Jane)",
  materials: [],
  constructionProgress: 0,
  operational: true,
  condition: 0,
  toolEfficiency: {
    Hammering: 100,
  },
  actions: [],
}));
mockEntity("structureHome", () => ({
  icon: tentIcon,
  name: "{code:1:Tent} (Jane)",
  materials: [],
  constructionProgress: 0,
  operational: true,
  condition: 2,
  toolEfficiency: {
    Hammering: 100,
  },
  actions: [],
  decorations: [
    {
      slotId: 0,
      slotName: "Hanging (small)",
    },
    {
      slotId: 1,
      itemId: mockEntityId("itemFloorDecor"),
      slotName: "Floor",
    },
    {
      slotId: 2,
      slotName: "Sleeping",
    },
  ],
}));
mockEntity("structureNoTool", () => ({
  icon: tentIcon,
  name: "{code:1:Tent} (Martha)",
  materials: [],
  condition: 0,
  constructionProgress: 30,
  operational: true,
  actions: [],
}));

mockEntity("shop", () => ({
  icon: tentIcon,
  name: "{code:1:Shop} (Bobby)",
  materials: [],
  condition: 0,
  operational: true,
  actions: [],
  maxListings: 5,
  buyListings: [
    {
      listingId: 1,
      item: {
        name: `{code:1:Stone}`,
        icon: pebbleIcon,
        durabilityStage: 0,
      },
      amount: 2500,
      essence: 30,
    },
    {
      listingId: 2,
      item: {
        name: `{code:1:Hammer}`,
        icon: stoneHammerIcon,
        quality: 2,
        durabilityStage: 1,
      },
      amount: 40,
      essence: 3,
    },
  ],
  sellListings: [
    {
      listingId: 1,
      item: {
        name: `{code:1:Bark Rope}`,
        icon: barkRopeIcon,
        amount: 22,
      },
      essence: 200,
    },
  ],
  withdraw: {
    essence: 20,
    items: [
      {
        name: "{d540869101:1:Strange Meat}",
        publicId: "7879cd",
        amount: 2,
        category: 200,
        id: 25629,
        actions: [
          {
            actionId: "eat",
            label: "Consume",
            actionPoints: 0,
            parameters: [
              {
                paramId: "amount",
                type: "integer",
                required: true,
                min: 1,
                max: 2,
              },
            ],
          },
        ],
        quality: 3,
        qualityName: "Excellent",
        isRuined: false,
        durabilityStage: 0,
        durabilityStageName: "Fresh",
        nutritionPercentage: 8,
        foodImpacts: [
          {
            name: "Strength",
            value: "+5.83",
            good: true,
          },
          {
            name: "Endurance",
            value: "+2.33",
            good: true,
          },
        ],
        icon: appleIcon,
        description: "A cooked piece of {cee304d9cb:1:Raw Meat}.",
        unitWeight: 1,
      },
    ],
  },
}));
