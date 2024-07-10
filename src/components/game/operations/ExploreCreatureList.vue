<template>
  <div>
    <CreatureDetailsModal
      :creatureId="showDetailsId"
      @close="showDetailsId = null"
      @action="showDetailsId = null"
    />
    <div v-for="creature in creatures" :key="creature.id">
      <ListItem flexible @click="showDetailsId = creature.id">
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
          <slot name="actions" :creature="creature" />
        </template>
      </ListItem>
      <APBar
        v-if="creature.operationInfo"
        :AP="apValue(creature.operationInfo.actionPoints)"
        :maxAP="apValue(creature.operationInfo.actionPointsMax)"
        :consideredAP="
          consideredApValue(
            creature.operationInfo.costAp,
            creature.operationInfo.actionPoints
          )
        "
        size="2"
        hideText
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    creatureIds: {},
  },

  data: () => ({
    showDetailsId: null,
  }),

  subscriptions() {
    return {
      creatures: this.$stream("creatureIds").switchMap((ids) =>
        GameService.getEntitiesStream(ids, ENTITY_VARIANTS.DETAILS)
      ),
    };
  },

  methods: {
    apValue(value) {
      return Math.floor(value / 60);
    },

    consideredApValue(consideredAP, AP) {
      const APminutes = AP / 60;
      const APfraction = APminutes - Math.floor(APminutes);
      if (consideredAP < 60) {
        return Math.round((100 * consideredAP) / 60) / 100;
      }
      const value = consideredAP / 60 - APfraction;
      return Math.ceil(value);
    },
  },
};
</script>

<style scoped lang="scss"></style>
