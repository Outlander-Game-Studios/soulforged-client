import pebbleIcon from "./assets/pebble.png";
import boarIcon from "./assets/boar.png";

const actions = {
  gather: {
    actionId: "gather",
    label: "Gather",
    actionPoints: 0,
    parameters: [],
  },
};

mockEntity("resource1", () => ({
  icon: boarIcon,
  name: "{code:1:Boar}",
  density: 2,
  densityName: "ample",
  densitySpeed: 2,
  actions: [actions.gather],
}));

mockEntity("resource2", () => ({
  icon: pebbleIcon,
  name: "{code:1:Pebble}",
  density: 3,
  densityName: "plenty",
  densitySpeed: 2,
  actions: [actions.gather],
}));
