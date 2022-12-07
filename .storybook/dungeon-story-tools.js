import Vue from "vue";
import VueCytoscape from "vue-cytoscape";
import dagre from "cytoscape-dagre";

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
              name: "dagre",
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
                  width: 250,
                  height: 130,
                },
              },
              {
                selector: "edge",
                style: {
                  "background-color": "green",
                  width: 3,
                  "target-arrow-shape": "triangle",
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
          const edges = [];
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
              edges.push({
                data: {
                  id: `edge-${roomId}-${target}`,
                  source: `${roomId}-room`,
                  target: `${target}-room`,
                },
                style: {
                  "line-color": loopColor,
                },
              });
            });
          });
          dungeonLayoutElements = this.cytoscapeConfig.elements = {
            nodes: roomNodes,
            edges: edges,
          };
          this.cytoscapeRender = this.cytoscapeRender + 1;
        },

        methods: {
          preConfig(cytoscape) {
            cytoscape.use(dagre);
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

        template: `
<div>
  <div :style="{position: 'relative', width: '100vw', height: '80%'}">
    <DungeonScene  :location="dungeonLocations[roomId]" />
  </div>
</div>`,
      },
      () => {},
      () => {}
    );
  },
};
