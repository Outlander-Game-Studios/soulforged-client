import pebbleIcon from "./assets/pebble.png";
import sharpenedStoneIcon from "./assets/sharp-stone.png";
import stoneKnifeIcon from "./assets/stone-knife.png";
import barkRopeIcon from "./assets/bark-rope.png";
import tentIcon from "./assets/tent.jpg";

export const crafts = [
  {
    craftId: "4ccf1fKnife",
    icon: stoneKnifeIcon,
    produce: [
      { publicId: "d9845f", itemDef: { icon: stoneKnifeIcon }, amount: 1 },
    ],
    materials: [
      { publicId: "228441", itemDef: { icon: sharpenedStoneIcon }, amount: 1 },
      { publicId: "1c686b", itemDef: { icon: barkRopeIcon }, amount: 1 },
    ],
  },
  {
    craftId: "4ccf1f",
    icon: sharpenedStoneIcon,
    produce: [
      { publicId: "d9845f", itemDef: { icon: sharpenedStoneIcon }, amount: 1 },
    ],
    materials: [
      { publicId: "228441", itemDef: { icon: pebbleIcon }, amount: 2 },
    ],
  },
];

export const plans = [
  {
    id: "dacb6e",
    name: "Tent",
    icon: tentIcon,
  },
];
