import wolfCorpseIcon from "./assets/wolf_corpse.png";
import appleImg from "./assets/apple.png";
import barkRopeImg from "./assets/bark-rope.png";
import dragonfruitImg from "./assets/dragonfruit.png";
import stoneHammerIcon from "./assets/stone-hammer.png";
import stoneKnifeIcon from "./assets/stone-knife.png";
import boneClubIcon from "./assets/bone-club.png";
import floorDecorIcon from "./assets/floor-decor.png";
import "./@utils.js";

const params = {
  amount: {
    paramId: "amount",
    type: "integer",
    required: true,
    min: 1,
    max: 1,
  },
};
const actions = {
  drop: {
    actionId: "drop",
    label: "Drop",
    actionPoints: 0,
    parameters: [params.amount],
  },
  eat: {
    actionId: "eat",
    label: "Consume",
    actionPoints: 0,
    parameters: [params.amount],
  },
  unEquip: {
    actionId: "un_equip_Weapon",
    label: "Unequip: Weapon",
    actionPoints: 0,
    parameters: [],
  },
};

const standard = {
  durabilityStage: 0,
  durabilityStageName: "Mint",
  quality: 0,
  qualityName: "Poor",
};

const itemTool = {
  icon: stoneHammerIcon,
  amount: 12,
  name: "{code:1:Hammer}",
  description: loremIpsum,
  unitWeight: 1,
  actions: [actions.drop],
  toolEfficiency: {
    Hammering: 100,
  },
  durabilityStage: 1,
  durabilityStageName: "Worn",
  quality: 2,
  qualityName: "Good",
};

const itemWeapon = {
  name: "{code:1:Bone Club}",
  description: loremIpsum,
  combatMoves: [
    {
      name: "Strike",
      skill: "Combat: mace",
      damage: {
        Blunt: 25,
        Cut: 4,
      },
    },
  ],
  durabilityStage: 2,
  durabilityStageName: "Battered",
  quality: 2,
  qualityName: "Good",
  amount: 1,
  unitWeight: 1,
  actions: [actions.drop, actions.unEquip],
  icon: boneClubIcon,
};
const itemToolWeapon = {
  ...itemTool,
  durabilityStage: 2,
  durabilityStageName: "Battered",
  quality: 0,
  qualityName: "Poor",
  toolEfficiency: {
    Hammering: 10,
    Instrument: 20,
  },
};

mockEntity("itemTool", () => itemTool);
mockEntity("itemWeapon", () => itemWeapon);
mockEntity("itemToolWeapon", () => itemToolWeapon);

mockEntity("itemMaterial", () => ({
  amount: 9,
  name: "{code:1:Bark Rope}",
  publicId: "1c686b",
  description: loremIpsum,
  quality: 3,
  unitWeight: 0.3,
  actions: [actions.drop, actions.eat],
  icon: barkRopeImg,
}));

mockEntity("itemFood1", () => ({
  amount: 1,
  name: "{code:1:Apple}",
  description: loremIpsum,
  icon: appleImg,
  unitWeight: 1,
  actions: [actions.drop, actions.eat],
  nutritionPercentage: 10,
  foodImpacts: [
    { name: "Mood", value: -10, good: false },
    { name: "Strength", value: 10, good: true },
    { name: "Dexterity", value: 10, good: true },
  ],
  ...standard,
}));

mockEntity("itemFood2", () => ({
  amount: 55,
  description: loremIpsum,
  name: "{code:1:Dragonfruit}",
  unitWeight: 1,
  actions: [actions.drop, actions.eat],
  icon: dragonfruitImg,
  nutritionPercentage: 10,
  ...standard,
}));

mockEntity("itemCorpse", () => ({
  name: "{code:1:Wolf} (corpse)",
  amount: 5,
  description: loremIpsum,
  actions: [actions.drop],
  durabilityStage: 0,
  unitWeight: 4.5,
  durabilityStageName: "Mint",
  icon: wolfCorpseIcon,
}));

mockEntity("itemFloorDecor", () => ({
  name: "{code:1:FloorDecor}",
  amount: 1,
  description: loremIpsum,
  actions: [actions.drop],
  durabilityStage: 0,
  unitWeight: 20,
  durabilityStageName: "Mint",
  decorSlots: ["Floor"],
  decorImpacts: [
    { name: "Strength", value: 15, good: true },
    { name: "Dexterity", value: 10, good: true },
  ],
  icon: floorDecorIcon,
}));

const allItemVarieties = [];
const DURABILITY_STAGE_NAMES = ["Mint", "Worn", "Battered", "Ruined"];
const QUALITY_NAMES = ["Poor", "Standard", "Good", "Excellent"];
[0, 1, 2, 3].forEach((quality) => {
  const nextAllItemsVarieties = [];
  allItemVarieties.push(nextAllItemsVarieties);
  [0, 1, 2, 3].forEach((durability) => {
    const key = `item${DURABILITY_STAGE_NAMES[durability]}${QUALITY_NAMES[quality]}`;
    nextAllItemsVarieties.push(key);
    mockEntity(key, () => ({
      amount: 1,
      actions: [actions.drop],
      icon: stoneHammerIcon,
      isRuined: durability === 3,
      durabilityStage: durability,
      durabilityStageName: DURABILITY_STAGE_NAMES[durability],
      quality: quality,
      qualityName: QUALITY_NAMES[quality],
    }));
  });
});
export { allItemVarieties };

const knownItemSearch = [
  {
    publicId: "id1",
    icon: stoneKnifeIcon,
    name: "{id2:1:Stone Knife}",
    qualityNames: ["Poor", "Standard", "Good", "Excellent"],
    durabilityNames: ["Mint", "Worn", "Battered", "Ruined"],
  },
  {
    publicId: "id3",
    icon: stoneHammerIcon,
    name: "{id2:1:Stone Hammer}",
    qualityNames: ["Poor", "Standard", "Good", "Excellent"],
    durabilityNames: ["Mint", "Worn", "Battered", "Ruined"],
  },
  {
    publicId: "id2",
    icon: appleImg,
    name: "{id2:1:Pone}",
    qualityNames: false,
    durabilityNames: ["Fresh", "Spoiling", "Rotting", "Decomposed"],
  },
];

GameService.mockRequest(REQUEST_CODES.SEARCH_KNOWN_ITEMS, (params) => {
  return knownItemSearch;
});
