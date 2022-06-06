<template>
  <div>
    <CloseButton class="close-button" @click="cancel()" />
    <LoadingPlaceholder v-if="!holding || !loadedCreatures" />
    <Vertical v-else>
      <Header> Manage Invitations <RichText :value="holding.name" /> </Header>
      <Header alt2> Current </Header>
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
        <ListItem
          v-for="creature in loadedCreatures"
          :key="creature.id"
          :lazyLoad="() => getCreatureDetailsStream(creature)"
        >
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
            <Button @click="addInvitee(creature)">Invite</Button>
          </template>
        </ListItem>
      </Vertical>
    </Vertical>
    <LoadingPlaceholder v-else />
  </div>
</template>

<script>
export default window.OperationManageInvites = {
  props: {
    operation: {},
  },

  data: () => ({}),

  subscriptions() {
    const holdingStream = this.$stream("operation").switchMap((operation) =>
      GameService.getEntityStream(
        operation.context.holding,
        ENTITY_VARIANTS.DETAILS
      )
    );
    const loadedCreaturesStream = Rx.combineLatest(
      GameService.getLocationStream().pluck("creatures"),
      GameService.getRootEntityStream()
    )
      .map(([ids, mainEntity]) => ids.filter((id) => id !== mainEntity.id))
      .switchMap((ids) => GameService.getEntitiesStream(ids))
      .map((loadedCreatures) =>
        loadedCreatures
          .filter((c) => !c.dead && !c.hostile && c.avatar)
          .sort(creaturesSort)
      );
    return {
      holding: holdingStream,
      loadedCreatures: loadedCreaturesStream,
    };
  },

  computed: {
    names() {
      return this.operation.context.current.sort();
    },
  },

  methods: {
    getCreatureDetailsStream(creature) {
      return GameService.getEntityStream(creature.id, ENTITY_VARIANTS.DETAILS);
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },

    addInvitee(creature) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "addInvite",
        creatureId: creature.id,
      }).then(() => {
        GameService.getRootEntityStream(false, true);
      });
    },

    removeInvitee(name) {
      GameService.request(REQUEST_CODES.UPDATE_OPERATION, {
        updateType: "removeInvite",
        name,
      }).then(() => {
        GameService.getRootEntityStream(false, true);
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
