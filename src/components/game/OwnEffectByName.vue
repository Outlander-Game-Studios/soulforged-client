<template>
  <Effects :effects="effects" />
</template>

<script>
export default {
  props: {
    name: {},
  },

  subscriptions() {
    return {
      effects: Rx.combineLatest([
        GameService.getRootEntityStream(),
        this.$stream("name"),
      ]).map(([mainEntity, name]) => {
        return mainEntity.effects.filter((e) => e.name === name);
      }),
    };
  },
};
</script>

<style scoped lang="scss"></style>
