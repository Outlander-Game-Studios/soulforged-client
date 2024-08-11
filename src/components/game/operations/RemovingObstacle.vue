<template>
  <div class="removing-obstacle-operation">
    <CloseButton class="close-button" @click="cancel()" />
    <LoadingPlaceholder v-if="!operation" />
    <Vertical v-if="!obstacle">
      <Header> Obstacle Removal </Header>
      <Description> The obstacle has been removed </Description>
      <HorizontalCenter>
        <Button @click="cancel()">Continue</Button>
      </HorizontalCenter>
    </Vertical>
    <Vertical v-else>
      <Header>
        Obstacle Removal
        <Help title="Removing Obstacles">
          You can remove obstacles in a dungeon by using tools. This does not
          use up Action Points, but instead will use up the tools
          <em>durability</em>.<br />
          If a tool has insufficient durability to remove the obstacle it'll
          instead add to removal progress and be used up.<br />
          Using a stack of tools to remove the obstacle will, when possible, use
          the durability of indovidual items instead of the whole stack.<br />
          <br />
          Different types of obstacles allow to use different tool types with
          different efficiency.
        </Help>
      </Header>
      <HorizontalCenter>
        <StructureIcon :structure="obstacle" :size="8" />
      </HorizontalCenter>
      <HorizontalFill>
        <ProgressBar :fills="progressFills" :size="3.5">
          <div class="progress-bar-text">Obstacle durability</div>
        </ProgressBar>
      </HorizontalFill>
      <Header alt> Tool Selection </Header>
      <FieldItemSelector
        :itemFilter="toolsFilter"
        :value="operation.context.toolId"
        @input="selectTool($event)"
        :size="4"
      />
      <div v-if="validTool">
        <Vertical v-if="operation.context.toolType">
          <HorizontalCenter>
            <LabeledValue :label="'Efficiency: ' + operation.context.toolType">
              {{ operation.context.toolEfficiency }}%
            </LabeledValue>
          </HorizontalCenter>
          <Header alt> Tool usage </Header>
          <HorizontalCenter>
            <ItemIcon
              :icon="tool.icon"
              :quality="tool.quality"
              :condition="tool.durabilityStage"
              :amount="1"
              :size="4"
            />
            <div
              class="arrow"
              :style="{
                'font-size': 4 + 'rem',
                'line-height': 4 + 'rem',
                height: 4 + 'rem',
              }"
            >
              ➭
            </div>
            <ItemIcon
              :icon="tool.icon"
              :quality="tool.quality"
              :condition="operation.context.toolStageAfterNext"
              :amount="1"
              :size="4"
            />
          </HorizontalCenter>
          <HorizontalCenter>
            <Button @click="commence()">Confirm</Button>
          </HorizontalCenter>
        </Vertical>
        <HorizontalCenter v-else>
          <LabeledValue>Ineffective tool</LabeledValue>
        </HorizontalCenter>
      </div>
    </Vertical>
  </div>
</template>

<script>
export default window.OperationRemovingObstacle = {
  props: {
    operation: {},
  },

  data: () => ({
    toolsFilter: (item) => Object.keys(item.toolEfficiency).length > 0,
  }),

  computed: {
    progressFills() {
      const { remainingDurability, durabilityToBeWorkedNext } =
        this.operation.context;
      return {
        red: remainingDurability - (durabilityToBeWorkedNext || 0),
        blue: durabilityToBeWorkedNext || 0,
      };
    },
    validTool() {
      return this.tool && !this.tool.isRuined;
    },
  },

  watch: {},

  subscriptions() {
    const contextStream = this.$stream("operation").pluck("context");

    return {
      tool: contextStream
        .pluck("toolId")
        .switchMap((id) =>
          id ? GameService.getEntityStream(id) : Rx.Observable.of(null)
        ),
      obstacle: contextStream
        .pluck("obstacleId")
        .switchMap((id) =>
          id ? GameService.getEntityStream(id) : Rx.Observable.of(null)
        ),
    };
  },

  mounted() {},

  beforeDestroy() {},

  methods: {
    selectTool(itemId) {
      this.action("selectTool", { itemId });
    },

    commence() {
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION).then(
        ({ statusChanges = [] } = {}) => {
          ToastNotify(statusChanges);
        }
      );
    },

    action(action, params = {}) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: action,
        ...params,
      }).then(({ statusChanges = [] } = {}) => {
        ToastNotify(statusChanges);
      });
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.removing-obstacle-operation {
  min-width: 30rem;
}

.progress-bar-text {
  display: flex;
  margin: 0.3rem 0.6rem 0;
  justify-content: flex-start;
  @include text-outline();

  font-size: 85%;
}
</style>
