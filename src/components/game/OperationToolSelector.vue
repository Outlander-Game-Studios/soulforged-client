<template>
  <div class="operation-tool-selector">
    <div v-if="operation.context.tools.length" class="outer-container">
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
              <div>
                {{ operation.context.toolsSelected[toolType].toolType }}
              </div>
              <div class="tool-efficiency">
                <div
                  v-if="!operation.context.toolsSelected[toolType].efficiency"
                >
                  Nothing selected
                </div>
                <LabeledValue
                  v-if="operation.context.toolsSelected[toolType].efficiency"
                  label="Speed"
                >
                  {{ operation.context.toolsSelected[toolType].efficiency }}%
                </LabeledValue>
              </div>
            </div>
          </Horizontal>
        </Container>
      </HorizontalFill>
    </div>
    <Modal
      dialog
      v-if="selectingToolType"
      title="Select tool"
      @close="selectingToolType = null"
    >
      <Vertical class="select-tool">
        <Header>Items</Header>
        <ItemSelector
          :filter="itemToolsFilter(selectingToolType)"
          @selected="selectItemTool(selectingToolType, $event)"
        >
          <template v-slot="{ item }">
            <LabeledValue label="Speed">
              {{ item.toolEfficiency[selectingToolType] }}%
            </LabeledValue>
          </template>
        </ItemSelector>
        <Header>Structures</Header>
        <StructureSelector
          :includeEmpty="false"
          :filter="structureToolsFilter(selectingToolType)"
          @selected="selectStructureTool(selectingToolType, $event)"
        >
          <template v-slot="{ structure }">
            <LabeledValue label="Speed">
              {{ structure.toolEfficiency[selectingToolType] }}%
            </LabeledValue>
          </template>
        </StructureSelector>
      </Vertical>
    </Modal>
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
.outer-container {
  min-width: 20rem;
}

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
  $height: 4rem;
  $padding-top: 0.5rem;
  padding: $padding-top 1.5rem 0 0.5rem;
  line-height: 1.6rem;
  overflow: hidden;
  height: $height - $padding-top;

  .tool-efficiency {
    line-height: 0;
    display: inline-block;
    min-width: 5.5rem;
    text-align: left;
    font-style: italic;
    font-size: 60%;
  }
}
</style>
