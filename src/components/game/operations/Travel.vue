<template>
  <div class="travel-wrapper">
    <Container borderType="alt" :borderSize="0.8" class="travel-container">
      <Spaced v-if="path && path.messageOnly">
        <CloseButton class="close-button" @click="cancel()" />
        <Description>
          {{ path.messageOnly }}
        </Description>
      </Spaced>
      <Vertical v-else>
        <CloseButton class="close-button" @click="cancel()" />
        <Header small alt2 v-if="operation.context.isBacktracking">
          Backtrack
          <Help title="Backtrack">
            Backtracking is travelling to the immediately previous location that your character has
            been at. This option guarantees that hostile creatures will not engage you when
            attempting to travel via this path.
          </Help>
        </Header>
        <Header small alt2 v-else>Travel</Header>
        <div v-if="operation.finished">
          <Button @click="cancel()">Close</Button>
        </div>
        <template v-else>
          <Horizontal>
            <SkillInfoDisplay :operation="operation" />
            <div v-if="structures && structures.length">
              <StructuresPanel :structures="structures" flexible :header="false" />
            </div>
          </Horizontal>
          <OperationToolSelector :operation="operation" />
          <HorizontalCenter>
            <Button @click="commence()">Commence</Button>
          </HorizontalCenter>
        </template>
      </Vertical>
    </Container>
  </div>
</template>

<script>
const OperationTravel = rxComponent({
  props: {
    operation: {},
  },

  data: () => ({}),

  watch: {
    operation() {
      this.updateConsideredAP()
    },
  },

  subscriptions() {
    return {
      path: this.$stream('operation')
        .pluck('context')
        .pluck('pathId')
        .switchMap((pathId) => GameService.getEntityStream(pathId)),
      structures: Rx.combineLatest(
        this.$stream('operation').pluck('context').pluck('pathId'),
        GameService.getStructuresIdsStream().switchMap((ids) => GameService.getEntitiesStream(ids)),
      ).map(([pathId, structures]) =>
        structures.filter((s) => s.pathId === pathId).map((s) => s.id),
      ),
      mainEntity: GameService.getRootEntityStream(),
    }
  },

  mounted() {
    this.updateConsideredAP()
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0)
  },

  methods: {
    commence() {
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
        locationId: this.mainEntity.location,
      }).then(({ statusChanges = [] } = {}) => {
        ToastNotify(statusChanges)
      })
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost)
    },
  },
})
window.OperationTravel = OperationTravel
export default OperationTravel
</script>

<style scoped lang="scss">
.travel-wrapper {
  font-size: 95%;
  position: relative;
  pointer-events: all;

  .travel-container {
    padding: 0.5rem;
  }
}

.close-button {
  z-index: 6;
}
</style>
