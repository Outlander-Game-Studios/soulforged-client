<template>
  <div class="operation-tool-selector">
    <Modal
      dialog
      v-if="selectingToolType"
      title="Select tool"
      @close="selectingToolType = null"
    >
      <Vertical class="select-tool">
        <ItemSelector
          :filter="itemToolsFilter(selectingToolType)"
          @selected="selectItemTool(selectingToolType, $event)"
        >
          <template v-slot="{ item }">
            {{ selectingToolType }}
            {{ item.toolEfficiency[selectingToolType] }}%
          </template>
        </ItemSelector>
        <StructureSelector
          :includeEmpty="false"
          :filter="structureToolsFilter(selectingToolType)"
          @selected="selectStructureTool(selectingToolType, $event)"
        >
          <template v-slot="{ structure }">
            {{ selectingToolType }}
            {{ structure.toolEfficiency[selectingToolType] }}%
          </template>
        </StructureSelector>
      </Vertical>
    </Modal>
    <div v-if="operation.context.tools.length">
      <Header alt2 class="tools-header">Tools</Header>
      <HorizontalFill
        v-for="toolType in operation.context.tools"
        :key="toolType"
      >
        <Container
          class="tools-used interactive"
          @click="mouseClickSelect(toolType)"
        >
          <Horizontal tight>
            <ItemIcon
              :icon="operation.context.toolsSelected[toolType].icon"
              :quality="operation.context.toolsSelected[toolType].quality"
              :condition="
                operation.context.toolsSelected[toolType].durabilityStage
              "
              :size="4"
            />
            <div class="tool-name">
              {{ operation.context.toolsSelected[toolType].toolType }}
              <span class="tool-efficiency">
                <span
                  v-if="operation.context.toolsSelected[toolType].efficiency"
                >
                  {{ operation.context.toolsSelected[toolType].efficiency }}%
                </span>
              </span>
            </div>
          </Horizontal>
        </Container>
      </HorizontalFill>
    </div>
  </div>
</template>

<script>
import buttonClickSound from "../../assets/sounds/button-click.ogg";

export default {
  props: {
    operation: {},
  },

  data: () => ({
    selectingToolType: null,
  }),

  methods: {
    mouseClickSelect(toolType) {
      SoundService.playSound(buttonClickSound);
      this.selectingToolType = toolType;
    },

    itemToolsFilter(toolType) {
      return (item) => !item?.isRuined && item?.toolEfficiency?.[toolType];
    },

    structureToolsFilter(toolType) {
      return (structure) =>
        structure.operational && structure.toolEfficiency?.[toolType];
    },

    selectItemTool(toolType, item) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectTool",
        toolType,
        itemId: item?.id,
      }).then(() => {
        this.selectingToolType = null;
      });
    },

    selectStructureTool(toolType, structure) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "selectTool",
        toolType,
        structureId: structure.id,
      }).then(() => {
        this.selectingToolType = null;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.operation-tool-selector {
  display: flex;
  justify-content: center;
}

.select-tool {
  min-width: 1rem;
}

.tools-header {
  font-size: 1.6rem !important;
}

.tool-name {
  padding: 0.7rem 0.5rem 0;

  .tool-efficiency {
    display: inline-block;
    min-width: 5.5rem;
    text-align: right;
    font-style: italic;
  }
}
</style>
