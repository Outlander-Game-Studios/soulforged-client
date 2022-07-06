<template>
  <div>
    <Header alt>Combat info</Header>
    <Spaced>
      <Header alt2>Offense</Header>
      <Spaced>
        <CombatMoves
          wrap
          noSpacing
          showDetailsOnClick
          :moves="mainEntity.combatMoves"
        />
      </Spaced>
      <Header alt2>Defense</Header>
      <Spaced>
        <LabeledValue
          v-for="armor in mainEntity.combatStats.defense"
          :label="armor.label"
          :icon="armor.icon"
          :key="armor.label"
        >
          {{ armor.value }}
        </LabeledValue>
      </Spaced>
    </Spaced>
  </div>
</template>

<script>
export default {
  props: {},

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
    };
  },
};
</script>

<style scoped lang="scss"></style>
