import farmIcon from "./assets/tent.jpg";
import soil0Img from "./assets/farm/soil_farm0.png";
import soil1Img from "./assets/farm/soil_farm1.png";
import soil2Img from "./assets/farm/soil_farm2.png";
import soil3Img from "./assets/farm/soil_farm3.png";
import soil4Img from "./assets/farm/soil_farm4.png";
import pepper0Img from "./assets/farm/pepper-grow-0.png";
import pepper1Img from "./assets/farm/pepper-grow-1.png";
import pepper2Img from "./assets/farm/pepper-grow-2.png";
import pepper3Img from "./assets/farm/pepper-grow-3.png";
import pepper4Img from "./assets/farm/pepper-grow-4.png";
import muckrootWeedImg from "./assets/farm/muckroot.weed.png";
import "./@utils.js";

const size = [11, 11];
const plotCount = size[0] * size[1];

const abandonAction = {
  actionId: "abandon",
  label: "Abandon",
  actionPoints: 0,
  parameters: [],
};
const tendAction = {
  actionId: "tend",
  label: "Tend to Farm",
  actionPoints: 0,
  parameters: [],
};

const water0 = {
  label: "Dry",
  image: soil0Img,
};
const water1 = {
  label: "Damp",
  image: soil1Img,
};
const water2 = {
  label: "Wet",
  image: soil2Img,
};
const water3 = {
  label: "Soggy",
  image: soil3Img,
};
const water4 = {
  label: "Flooded",
  image: soil4Img,
};
const plantName = "{00a106e547:0:Food}";
const plant0 = {
  name: plantName,
  stage: 0,
  image: pepper0Img,
};
const plant1 = {
  name: plantName,
  stage: 0,
  image: pepper1Img,
};
const plant2 = {
  name: plantName,
  stage: 0,
  image: pepper2Img,
};
const plant3 = {
  name: plantName,
  stage: 0,
  image: pepper3Img,
};
const plant4 = {
  name: plantName,
  stage: 0,
  image: pepper4Img,
};
const plotBase = {
  actions: [],
  water: water2,
};
const weed = {
  name: "{ec7d8bf367:1:Yuckroot}",
  image: muckrootWeedImg,
};

const plots = [
  {
    ...plotBase,
    water: water0,
    plant: plant0,
    weed,
  },
  {
    ...plotBase,
    water: water1,
    plant: plant4,
    weed,
  },
  {
    ...plotBase,
    vermin: {
      id: mockEntityId("mob1"),
    },
    plant: plant1,
    weed,
  },
  {
    ...plotBase,
    plant: plant2,
  },
  {
    ...plotBase,
    water: water3,
  },
  {
    ...plotBase,
    plant: plant3,
    water: water4,
  },
];

Array.create(plotCount).forEach((_, idx) => {
  mockEntity(`farmPlot${idx}`, () => plots[idx % plots.length]);
});

mockEntity("farm", () => ({
  icon: farmIcon,
  name: "{code:1:Farm} (Bobby)",
  materials: [],
  constructionProgress: 100,
  operational: true,
  structureClass: "Building",
  condition: 0,
  own: true,
  farmSize: size,
  plots: Array.create(plotCount).map((_, idx) =>
    mockEntityId(`farmPlot${idx}`)
  ),
  actions: [abandonAction, tendAction],
}));
