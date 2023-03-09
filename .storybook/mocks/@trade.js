import floorDecorIcon from "./assets/floor-decor.png";
import appleIcon from "./assets/apple.png";
import stoneKnifeIcon from "./assets/stone-knife.png";

const params = {
  amount: {
    paramId: "amount",
    type: "integer",
    required: true,
    default: 1,
    min: 1,
    max: 1,
  },
  essence: {
    paramId: "essence",
    type: "essence",
    required: true,
    default: 0,
    min: 0,
    max: 30000000,
  },
  tradeItem: {
    paramId: "itemIdentifier",
    type: "tradeItem",
  },
  item: {
    paramId: "itemId",
    type: "item",
  },
  confirmCancel: {
    type: "message",
    text: "Are you sure you want to cancel this trade?",
  },
};

mockEntity("trade", () => ({
  actions: [
    {
      actionId: "cancelTrade",
      label: "Cancel",
      parameters: [params.confirmCancel],
    },
    {
      actionId: "dismissTrade",
      label: "Dismiss",
      parameters: [],
    },
    {
      actionId: "toggleAcceptTrade",
      label: "Accept",
      parameters: [],
    },
    {
      actionId: "addItem",
      label: "Add to Trade",
      parameters: [params.item, params.amount],
    },
    {
      actionId: "removeItem",
      label: "Remove Item",
      parameters: [params.tradeItem],
    },
    {
      actionId: "setEssence",
      label: "Set Essence",
      parameters: [params.essence],
    },
  ],
  canUpdate: true,
  canAccept: true,
  me: {
    who: mockEntityId("mainEntity"),
    essence: 3000,
    items: [
      {
        name: "{code:1:FloorDecor}",
        durabilityStage: 0,
        durabilityStageName: "Mint",
        icon: floorDecorIcon,
        amount: 8,
        identifier: "d4563rtge::1",
      },
      {
        name: "{code:1:Food}",
        durabilityStage: 1,
        durabilityStageName: "Worn",
        icon: appleIcon,
        amount: 1,
        quality: 3,
        identifier: "d4563r111::1",
      },
    ],
  },
  them: {
    who: mockEntityId("mainEntity2"),
    essence: 20000000000,
    items: [
      {
        name: "{code:1:Knife}",
        durabilityStage: 2,
        durabilityStageName: "Battered",
        icon: stoneKnifeIcon,
        amount: 50000,
        quality: 2,
        identifier: "d4563r111::1",
      },
    ],
  },
}));
