<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <LoadingPlaceholder v-if="!holding || !loadedCreatures" />
    <Vertical v-else>
      <Header> Manage Invitations <RichText :value="holding.name" /> </Header>
      <Header alt2> Current ({{ names.length }}) </Header>
      <div v-if="!names.length" class="empty-text">None</div>
      <Vertical tight v-else>
        <div v-for="name in names" :key="name" class="flex">
          <Spaced class="flex-grow">{{ name }}</Spaced>
          <Button @click="removeInvitee(name)">Remove</Button>
        </div>
      </Vertical>

      <Header alt2> Add new </Header>
      <!-- DUPLICATION -->
      <Vertical tight>
        <div v-if="!loadedCreatures.length" class="empty-text">None</div>
        <div v-for="creature in loadedCreatures" :key="creature.id">
          <div v-if="!namesMap[creature.name]">
            <ListItem>
              <template v-slot:icon>
                <CreatureIcon :creature="creature" />
              </template>
              <template v-slot:title>
                <RichText :value="creature.name" />
              </template>
              <template v-slot:subtitle>
                <Effects row :effects="creature.effects" :size="3" />
              </template>
              <template v-slot:buttons>
                <Button @click="addInvitee(creature)">{{
                  currentNamesMap[creature.name] ? 'Update name' : 'Invite'
                }}</Button>
              </template>
            </ListItem>
          </div>
        </div>
      </Vertical>
    </Vertical>
  </div>
</template>

<script>
const OperationManageInvites = rxComponent({
  props: {
    operation: {},
  },

  data: () => ({}),

  subscriptions() {
    const holdingStream = this.$stream('operation').switchMap((operation) =>
      GameService.getEntityStream(operation.context.holding, ENTITY_VARIANTS.DETAILS),
    )
    const loadedCreaturesStream = Rx.combineLatest(
      GameService.getLocationStream().pluck('creatures'),
      GameService.getRootEntityStream(),
    )
      .map(([ids, mainEntity]) => ids.filter((id) => id !== mainEntity.id))
      .switchMap((ids) => GameService.getEntitiesStream(ids, ENTITY_VARIANTS.DETAILS))
      .map((loadedCreatures) =>
        loadedCreatures.filter((c) => !c.dead && !c.hostile && c.avatar).sort(creaturesSort),
      )
    return {
      holding: holdingStream,
      loadedCreatures: loadedCreaturesStream,
    }
  },

  computed: {
    names() {
      return this.operation.context.current.sort()
    },
    namesMap() {
      return this.names.toObject()
    },
    currentNamesMap() {
      return this.names
        .map((name) => name.match(/\((.*)\)/)?.[1])
        .filter((name) => !!name)
        .toObject()
    },
  },

  methods: {
    getCreatureDetailsStream(creature) {
      return GameService.getEntityStream(creature.id, ENTITY_VARIANTS.DETAILS)
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },

    addInvitee(creature) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: 'addInvite',
        creatureId: creature.id,
      }).then(() => {
        GameService.getRootEntityStream(false, true)
      })
    },

    removeInvitee(name) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: 'removeInvite',
        name,
      }).then(() => {
        GameService.getRootEntityStream(false, true)
      })
    },
  },
})
window.OperationManageInvites = OperationManageInvites
export default OperationManageInvites
</script>

<style scoped lang="scss"></style>
