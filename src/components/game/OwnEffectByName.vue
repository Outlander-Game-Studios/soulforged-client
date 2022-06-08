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
        this.$stream("effectId"),
      ]).map(([mainEntity, effectId]) => {
        console.log(
          mainEntity.effects,
          mainEntity.effects.filter((e) => e.name === this.name)
        );
        return mainEntity.effects.filter((e) => e.name === this.name);
      }),
    };
  },
};
</script>

<style scoped lang="scss"></style>
