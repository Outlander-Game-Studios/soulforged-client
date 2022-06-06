import appleImg from "./assets/apple.png";
import barkRopeImg from "./assets/bark-rope.png";
import dragonfruitImg from "./assets/dragonfruit.png";
import stoneHammerIcon from "./assets/stone-hammer.png";
import bruiseIcon from "./assets/bruise.png";
import cutIcon from "./assets/cut.png";
import hungerIcon from "./assets/hunger.png";
import moodUpIcon from "./assets/mood_up.png";
import bloodLossIcon from "./assets/blood_loss.png";

export const effects = {
  weapon: {
    name: "Weapon: StoneHammer",
    icon: stoneHammerIcon,
    order: 3,
    impacts: [],
  },
  hunger: {
    name: "Hungry (Minor)",
    icon: hungerIcon,
    severity: 1,
    impacts: [
      {
        name: "Efficiency",
        value: "x0.56",
        good: false,
      },
    ],
    order: 1,
  },
  food1: {
    name: "Food",
    icon: appleImg,
    order: 4,
    duration: 1358,
    impacts: [
      {
        name: "Mood",
        value: -41.67,
        good: false,
      },
      {
        name: "Strength",
        value: 25,
        good: true,
      },
      {
        name: "Endurance",
        value: 4.17,
        good: true,
      },
    ],
  },
  food2: {
    name: "Food",
    icon: dragonfruitImg,
    order: 4,
    duration: [2238, 2666],
    impacts: [
      {
        name: "Strength",
        value: 24.17,
        good: true,
      },
      {
        name: "Endurance",
        value: 9.67,
        good: true,
      },
    ],
  },
  moodOk: {
    name: "Content",
    icon: moodUpIcon,
    order: 0,
    severity: 0,
    impacts: [
      {
        name: "Efficiency",
        value: "x2.56",
        good: false,
      },
    ],
  },
  bloodLoss: {
    name: "Minor blood loss",
    icon: bloodLossIcon,
    order: 1,
    severity: 1,
    impacts: [
      {
        name: "Strength multiplier",
        value: 0.8,
        good: false,
      },
    ],
  },
  wouldBruise: {
    name: "Bruise",
    icon: bruiseIcon,
    order: 2,
    severity: 2,
    stacks: 4,
    duration: [107, 134],
    impacts: [
      {
        name: "Pain",
        value: 12,
        good: false,
      },
      {
        name: "Internal injury",
        value: 0.4,
        good: false,
      },
    ],
  },
  woundCut: {
    name: "Cut",
    icon: cutIcon,
    severity: 3,
    order: 2,
    stacks: 2233964656,
    duration: [700, 1200],
    impacts: [
      {
        name: "Blood Loss",
        value: 2233964656,
        good: false,
      },
      {
        name: "Pain",
        value: 2233964656,
        good: false,
      },
      {
        name: "Strength",
        value: -2233964656,
        good: false,
      },
    ],
  },
};
