import Vue from "vue";
import VueCytoscape from "vue-cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import flatten from "lodash/flatten.js";

Vue.use(VueCytoscape);

let dungeonLocations = {};
let dungeonLayoutElements = null;

global.CLIMATE_TYPES = {
  DARKNESS: "DARKNESS",
};
global.WORLD_FOLDER_ASSETS_DUNGEONS = "./";
global.Dungeon = {
  registerDungeon: () => {},
};
global.DungeonStoryTools = {
  roomStoriesBuilder(importedDungeon) {
    return importedDungeon.rooms.toObject(
      (room) => room.roomId.replace(/-/g, "_"),
      (room) => DungeonStoryTools.loadDungeonRoom(importedDungeon, room.roomId)
    );
  },

  loadDungeonData(importedDungeon) {
    dungeonLocations = importedDungeon.rooms.toObject(
      (room) => room.roomId,
      (room) => ({
        dungeon: {
          ...room,
          assets: {
            ...room.assets,
            doodads: flatten(room.assets.doodads),
          },
        },
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
              name: "preset",
              // name: "cose-bilkent",
              // randomize: false,
              // padding: 5,
              // animationDuration: 0,
              // idealEdgeLength: 20,
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
            if (!room.dungeon.layout) {
              throw new Error(
                `Missing layout: ${JSON.stringify(room.dungeon)}`
              );
            }
            return {
              data: {
                id: `${roomId}-room`,
                label: roomId,
              },
              position: {
                x: room.dungeon.layout.x * 250,
                y: room.dungeon.layout.y * 120,
              },
              style: {
                "background-color": colorRoom,
              },
            };
          });
          const edges = {};
          const pathPropsMap = importedDungeon.pathProps.toObject((p) =>
            p.connecting.sort().join("__")
          );
          Object.values(dungeonLocations).forEach((room) => {
            const roomId = room.dungeon.roomId;
            Object.values(room.dungeon.paths).forEach((target) => {
              if (!dungeonLocations[target]) {
                roomNodes.push({
                  data: {
                    id: `${target}-room`,
                    label: "OUTSIDE",
                  },
                  position: { x: 0, y: 0 },
                  style: {
                    "background-color": "skyblue",
                  },
                });
              }
              const edgeId = [roomId, target].sort().join("__");
              const pathProps = pathPropsMap[edgeId] || {};
              let color = loopColor;
              switch (pathProps.pathType) {
                case "DungeonObstaclePath":
                  color = "firebrick";
                  break;
                case "DungeonDropPath":
                  color = "black";
                  break;
                case "CliffPath":
                  color = "burlywood";
                  break;
              }

              if (edges[edgeId]) {
                edges[edgeId].style["source-arrow-shape"] = "circle";
                edges[edgeId].style["target-arrow-shape"] = "circle";
                edges[edgeId].style["source-arrow-color"] = color;
                edges[edgeId].style["target-arrow-color"] = color;
              } else {
                edges[edgeId] = {
                  data: {
                    id: `edge-${edgeId}`,
                    source: `${roomId}-room`,
                    target: `${target}-room`,
                  },
                  style: {
                    "line-color": color,
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
    :style="{background: 'cornflowerblue'}"
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
