<template>
  <LoadingPlaceholder v-if="!info" />
  <Icon v-else :src="info.icon" backgroundType="alt" :size="size" />
</template>

<script>
export default rxComponent({
  props: {
    stat: {},
    size: {},
  },

  subscriptions() {
    return {
      info: this.$stream('stat').switchMap((stat) =>
        GameService.getInfoStream('STATISTICS', { stat }, true),
      ),
    }
  },
})
</script>

<style scoped lang="scss"></style>
