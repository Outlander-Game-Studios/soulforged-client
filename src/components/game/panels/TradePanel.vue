<template>
  <div>
    <Header>Trades</Header>
    <LoadingPlaceholder v-if="!trades" />
    <div v-else-if="!trades.length" class="empty-text">No pending trades</div>
    <div v-else>
      <Trade v-for="trade in trades" :key="trade.id" :trade="trade" />
    </div>
    <Spaced>
      <HorizontalCenter>
        <Button @click="startNewTrade()">Start new trade</Button>
      </HorizontalCenter>
    </Spaced>
    <Modal v-if="startingNewTrade" dialog large @close="startingNewTrade = false">
      <template v-slot:title> Start trade </template>
      <template v-slot:contents>
        <LoadingPlaceholder v-if="!loadedCreatures" />
        <div v-else-if="!loadedCreatures.length" class="empty-text">
          There is no one to trade with here
        </div>
        <div v-else v-for="creature in loadedCreatures" :key="creature.id">
          <ListItem :lazyLoad="() => getCreatureDetailsStream(creature)" v-if="creature">
            <template v-slot:icon="{ lazyData: creatureDetails }">
              <CreatureIcon :creature="creatureDetails" />
            </template>
            <template v-slot:title="{ lazyData: creatureDetails }">
              <RichText :value="creatureDetails.name" />
            </template>
            <template v-slot:subtitle="{ lazyData: creatureDetails }">
              <Effects row :effects="creatureDetails.effects" :size="3" />
            </template>
            <template v-slot:buttons="{ lazyData: creatureDetails }">
              <Actions
                :target="creatureDetails"
                actionId="trade"
                @action="startingNewTrade = false"
              />
            </template>
          </ListItem>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({
    startingNewTrade: false,
  }),

  subscriptions() {
    const loadedCreaturesStream = Rx.combineLatest(
      GameService.getLocationStream().pluck('creatures'),
      GameService.getRootEntityStream(),
    )
      .map(([ids, mainEntity]) => ids.filter((id) => id !== mainEntity.id))
      .switchMap((ids) => GameService.getEntitiesStream(ids))
      .map((loadedCreatures) =>
        loadedCreatures.filter((c) => !c.dead && !c.hostile && c.avatar).sort(creaturesSort),
      )
    return {
      trades: GameService.getRootEntityStream()
        .pluck('trades')
        .switchMap((ids) => GameService.getEntitiesStream(ids)),
      loadedCreatures: this.$stream('startingNewTrade').switchMap((load) =>
        load ? loadedCreaturesStream : Rx.Observable.empty(),
      ),
    }
  },

  methods: {
    startNewTrade() {
      this.startingNewTrade = true
    },

    getCreatureDetailsStream(creature) {
      return GameService.getEntityStream(creature.id, ENTITY_VARIANTS.DETAILS)
    },
  },
})
</script>

<style scoped lang="scss"></style>
