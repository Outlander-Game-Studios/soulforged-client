import Vue from "vue";
import VueCytoscape from "vue-cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

Vue.use(VueCytoscape);

let dungeonLocations = {};
let dungeonLayoutElements = null;

global.WORLD_FOLDER_ASSETS_DUNGEONS = "./";
global.Dungeon = {
  registerDungeon: () => {},
};
global.DungeonStoryTools = {
  loadDungeonData(importedDungeon) {
    dungeonLocations = importedDungeon.rooms.toObject(
      (room) => room.roomId,
      (room) => ({
        dungeon: room,
      })
    );
  },

  loadDungeonLayout(importedDungeon) {
    return mockComponent(
      {
        data: () => ({
          cytoscapeRender: 1,
          cytoscapeConfig: {
            layout: {
              name: "cose-bilkent",
              randomize: false,
              padding: 5,
              animationDuration: 0,
              idealEdgeLength: 20,
            },
            elements: dungeonLayoutElements,
            style: [
              {
                selector: "node",
                style: {
                  shape: "round-rectangle",
                  label: (el) => el.data("label"),
                  "text-valign": "center",
                  "text-halign": "center",
                  "text-wrap": "wrap",
                  "text-max-width": 240,
                  width: 180,
                  height: 40,
                },
              },
              {
                selector: "edge",
                style: {
                  "background-color": "green",
                  width: 3,
                  "arrow-scale": 2,
                  "target-arrow-color": "red",
                  "curve-style": "bezier",
                },
              },
            ],
          },
        }),

        created() {
          DungeonStoryTools.loadDungeonData(importedDungeon);
          const colorRoom = "orange";
          const loopColor = "lightgoldenrodyellow";

          const roomNodes = Object.values(dungeonLocations).map((room) => {
            const roomId = room.dungeon.roomId;
            return {
              data: {
                id: `${roomId}-room`,
                label: roomId,
              },
              style: {
                "background-color": colorRoom,
              },
            };
          });
          const edges = {};
          Object.values(dungeonLocations).forEach((room) => {
            const roomId = room.dungeon.roomId;
            console.log(room.dungeon.paths);
            Object.values(room.dungeon.paths).forEach((target) => {
              if (!dungeonLocations[target]) {
                roomNodes.push({
                  data: {
                    id: `${target}-room`,
                    label: "OUTSIDE",
                  },
                  style: {
                    "background-color": "skyblue",
                  },
                });
              }
              const edgeId = [roomId, target].sort().join("__");
              if (edges[edgeId]) {
                edges[edgeId].style["target-arrow-shape"] = null;
              } else {
                edges[edgeId] = {
                  data: {
                    id: `edge-${edgeId}`,
                    source: `${roomId}-room`,
                    target: `${target}-room`,
                  },
                  style: {
                    "line-color": loopColor,
                    "target-arrow-shape": "triangle",
                  },
                };
              }
            });
          });
          dungeonLayoutElements = this.cytoscapeConfig.elements = {
            nodes: roomNodes,
            edges: Object.values(edges),
          };
          this.cytoscapeRender = this.cytoscapeRender + 1;
        },

        methods: {
          preConfig(cytoscape) {
            cytoscape.use(coseBilkent);
          },
        },

        template: `
<div>
  <cytoscape
    :key="cytoscapeRender"
    class="cytoscape"
    ref="cy"
    :config="cytoscapeConfig"
    :preConfig="preConfig"
  />
</div>`,
      },
      () => {},
      () => {}
    );
  },

  loadDungeonRoom(importedDungeon, roomId) {
    return mockComponent(
      {
        data: () => ({
          dungeonLocations,
          roomId,
        }),

        created() {
          DungeonStoryTools.loadDungeonData(importedDungeon),
            (this.dungeonLocations = dungeonLocations);
        },

        computed: {
          locationMock() {
            return {
              indoors: true,
            };
          },
          pathsMock() {
            const pathsDef = this.dungeonLocations[roomId].dungeon.paths;
            return Object.keys(pathsDef).map((position) => ({
              id: pathsDef[position],
              accidentGrade: 0,
              position: +position,
              info: pathsDef[position],
              actions: [
                {
                  actionId: "travel",
                  label: "Travel",
                  actionPoints: 0,
                  parameters: [],
                },
              ],
            }));
          },
        },

        template: `
<div>
  <div :style="{position: 'relative', width: '100vw', height: '80%'}">
    <Location :locationOverride="locationMock" :pathsOverride="pathsMock" />
    <DungeonScene :location="dungeonLocations[roomId]" />
  </div>
</div>`,
      },
      () => {},
      () => {}
    );
  },
};
