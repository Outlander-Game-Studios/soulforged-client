<template>
  <RichText v-if="internalCreature" :value="internalCreature.name" />
</template>

<script>
export default rxComponent({
  props: {
    creatureId: {},
  },

  subscriptions() {
    return {
      internalCreature: this.$stream('creatureId').switchMap((creatureId) =>
        GameService.getEntityStream(creatureId, ENTITY_VARIANTS.DETAILS),
      ),
    }
  },
})
</script>
