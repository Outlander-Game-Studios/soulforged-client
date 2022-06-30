import "./@utils.js";
import trackFreshIcon from "./assets/track_fresh.png";
import wolfIcon from "./assets/wolf.png";

mockEntity(
  "mob1",
  () => ({
    name: "{6e2f9fe745:1:Wolf}",
    icon: wolfIcon,

    trackable: true,
    effects: [],
    tracks: [
      {
        text: "Distracted",
        icon: trackFreshIcon,
      },
    ],
    hostile: true,
    inCombat: false,
    description:
      "A small, furred animal. Wary when they notice you getting anywhere near them.",
    dead: false,
    actions: [
      {
        actionId: "approach",
        label: "Assault",
        actionPoints: 0,
        parameters: [],
      },
    ],
  }),
  [ENTITY_VARIANTS.BASE]
);
