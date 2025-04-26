<template>
  <div>
    <p>
      The game is built around Action Points (APs). Every 15 minutes you will gain additional 15 APs
      up to a maximum of {{ maxAP }}. You do not need to have the game open to gain your APs. There
      is <em>no other way</em> to gain additional APs or gain them faster, be it in-game or outside
      the game.
    </p>
    <p>
      Most in-game actions require APs, including travelling, gathering, crafting or engaging in
      combat. Your APs are also spent automatically when your available APs reach the maximum and
      you let them accumulate beyond that point. Only part of the APs gained while at maximum is
      spent, effectively meaning effects like hunger and thirst accumulate slower when inactive.
    </p>
    <p>
      Every time your APs are spent it means time is passing for your character. This results timed
      effects like wounds or food will continue to expire as APs are spent. Outside of spending APs
      the time is effectively frozen for your character.
    </p>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      maxAP: GameService.getRootEntityStream()
        .pluck('actionPointsMax')
        .map((value) => Math.floor(value / 60)),
    }
  },
})
</script>

<style scoped lang="scss">
em {
  font-weight: bold;
}
</style>
