import Vue from "vue";
import VueCytoscape from "vue-cytoscape";
import dagre from "cytoscape-dagre";

Vue.use(VueCytoscape);

let dungeonLocations = {};
let dungeonLayoutElements = null;

global.DungeonStoryTools = {
  loadDungeonData(importResult) {
    global.WORLD_FOLDER_ASSETS = "/world/assets";
    global.Dungeon = {
      registerDungeon: () => {},
    };

    return importResult.then(({ default: definition }) => {
      dungeonLocations = definition.rooms.toObject(
        (room) => room.roomId,
        (room) => ({
          dungeon: room,
        })
      );
    });
  },

  loadDungeonLayout(importResult) {
    let component;
    let vmPromise = new Promise((resolve) => {
      component = mockComponent(
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
            resolve(this);
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
    });
    Promise.all([
      vmPromise,
      DungeonStoryTools.loadDungeonData(importResult),
    ]).then(([vm]) => {
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
      dungeonLayoutElements = vm.cytoscapeConfig.elements = {
        nodes: roomNodes,
        edges: edges,
      };
      vm.cytoscapeRender = vm.cytoscapeRender + 1;
    });
    return component;
  },

  loadDungeonRoom(importResult, roomId) {
    let component;
    let vmPromise = new Promise((resolve) => {
      component = mockComponent(
        {
          data: () => ({
            dungeonLocations,
            roomId,
          }),

          created() {
            resolve(this);
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
    });
    Promise.all([
      vmPromise,
      DungeonStoryTools.loadDungeonData(importResult),
    ]).then(([vm]) => {
      vm.dungeonLocations = dungeonLocations;
    });
    return component;
  },
};
