import backwall from "./assets/dungeon/back_wall_repeating.png";
import ceiling from "./assets/dungeon/ceiling.png";
import floor from "./assets/dungeon/center_floor.png";
import fillTop from "./assets/dungeon/fillTop.png";
import fillBottom from "./assets/dungeon/fillBottom.png";
import wallLeft from "./assets/dungeon/left_wall.png";
import wallRight from "./assets/dungeon/right_wall.png";
import doorOpenUp from "./assets/dungeon/door_open_up.png";

export const dungeonAssets = {
  backwall,
  ceiling,
  floor,
  fillTop,
  fillBottom,
  wallLeft,
  wallRight,
  doodads: [
    {
      img: doorOpenUp,
      placement: [60, 43.5],
      size: 50,
      layer: 5,
    },
  ],
};
