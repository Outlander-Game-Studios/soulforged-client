<template>
  <div class="explore-operation">
    <CloseButton class="close-button" @click="cancel()" />
    <Header>Exploration</Header>
    <LoadingPlaceholder v-if="!requestingIds || !inviteesIds" />
    <Vertical v-else-if="!isLeading && !amInvited">
      <Spaced>
        <HorizontalCenter>
          <Description prominent>Waiting to be invited by</Description>
        </HorizontalCenter>
      </Spaced>
      <ExploreCreatureList :creatureIds="[operation.context.leadExplorer]" />
    </Vertical>
    <Vertical v-else>
      <Vertical>
        <Header alt>Pending Requests</Header>
        <div v-if="!requestingIds.length" class="empty-text">No one</div>
        <ExploreCreatureList v-else :creatureIds="requestingIds">
          <template v-slot:actions="{ creature: creature }">
            <Button v-if="isLeading" @click="accept(creature)">Accept</Button>
          </template>
        </ExploreCreatureList>
      </Vertical>
      <Vertical>
        <Header alt>Invited</Header>
        <div v-if="!inviteesIds.length" class="empty-text">No one</div>
        <ExploreCreatureList v-else :creatureIds="inviteesIds">
          <template v-slot:actions="{ creature: creature }">
            <Button v-if="isLeading" @click="kick(creature)">Kick</Button>
          </template>
        </ExploreCreatureList>
      </Vertical>
      <Header alt>Leader</Header>
      <ExploreCreatureList :creatureIds="[operation.context.leadExplorer]">
      </ExploreCreatureList>
      <Button v-if="isLeading" @click="commence()">Commence</Button>
    </Vertical>
  </div>
</template>

<script>
export default window.OperationExplore = {
  props: {
    operation: {},
  },

  data: () => ({}),

  watch: {
    operation() {
      this.updateConsideredAP();
    },
  },

  subscriptions() {
    const mainEntityStream = GameService.getRootEntityStream();
    const operationStream = this.$stream("operation");
    const leadExplorerStream = operationStream
      .map((op) => op.context.leadExplorer)
      .switchMap((id) => GameService.getEntityStream(id));
    const inviteesIdsStream = leadExplorerStream.map(
      (c) => c.operationInfo.invited
    );
    const requestingIdsStream = leadExplorerStream.map(
      (c) => c.operationInfo.requesting
    );
    return {
      leadExplorer: leadExplorerStream,
      isLeading: operationStream.map((op) => op.context.isLeading),
      amInvited: Rx.combineLatest(inviteesIdsStream, mainEntityStream).map(
        ([inviteesIds, mainEntity]) => inviteesIds.includes(mainEntity.id)
      ),
      inviteesIds: inviteesIdsStream,
      requestingIds: requestingIdsStream,
    };
  },

  mounted() {
    this.updateConsideredAP();
  },

  beforeDestroy() {
    ControlsService.updateConsideredAP(0);
  },

  methods: {
    accept(creature) {
      this.action("accept", { pawnId: creature.id });
    },

    kick(creature) {
      this.action("kick", { pawnId: creature.id });
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

    updateConsideredAP() {
      ControlsService.updateConsideredAP(this.operation.context.unitCost);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.explore-operation {
  min-width: 30rem;
}
</style>
