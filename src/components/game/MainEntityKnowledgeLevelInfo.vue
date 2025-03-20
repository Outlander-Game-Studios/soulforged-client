<template>
  <div v-if="mainEntity">
    <Header alt v-if="!noHeader">Combat info</Header>
    <Spaced>
      <Vertical>
        <Header alt2>
          Abilities
          <Help title="Abilities">
            <HelpAttackStats />
          </Help>
        </Header>
        <CombatMoves wrap noSpacing showDetailsOnClick :moves="mainEntity.combatStats.moves" />
        <Header alt2>
          Defense
          <Help title="Defense">
            <HelpDefenseStats />
          </Help>
        </Header>
        <div>
          <LabeledValue
            v-if="stealthMultiplier !== 1"
            label="Stealth"
            :good="stealthMultiplier > 1"
            :bad="stealthMultiplier < 1"
          >
            x{{ Math.round(stealthMultiplier * 100) / 100 }}
            <Help title="Stealth">
              <HelpStealth />
            </Help>
          </LabeledValue>
          <LabeledValue label="Defense rating">
            {{ mainEntity.combatStats.defense }}
          </LabeledValue>
          <LabeledValue
            v-for="armor in mainEntity.combatStats.armor"
            :label="armor.label"
            :icon="armor.icon"
            :key="armor.label"
          >
            {{ armor.value }}
          </LabeledValue>
        </div>
      </Vertical>
    </Spaced>
  </div>
</template>

<script>
export default {
  props: {
    noHeader: {
      type: Boolean,
    },
  },

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
    }
  },

  computed: {
    stealthMultiplier() {
      const stealthImpacts = [...this.mainEntity.environment, ...this.mainEntity.effects]
        .map((e) => e.impacts?.find((i) => i.name === 'Stealth')?.value.replace('x', '') || 1)
        .map((v) => +v)
      return stealthImpacts.reduce(multiply, 1)
    },
  },
}
</script>

<style scoped lang="scss"></style>
