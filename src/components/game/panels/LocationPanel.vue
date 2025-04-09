<template>
  <div class="location-panel" v-if="location">
    <EnvironmentPanel :location="location" />
    <CreaturesPanel :creatures="location.creatures" />
    <template v-if="!location.indoors">
      <ResourcesPanel :resources="location.resources" />
    </template>
    <Spaced v-if="false"><LocationSpacing :location="location" /></Spaced>
    <StructuresPanel :structures="structures" />
    <template v-if="location.indoors">
      <DecorationsPanel />
    </template>
    <Inventory header="Location Inventory" :inventory="locationInventory" includeCrafts />
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({}),

  subscriptions() {
    const mainEntity = GameService.getRootEntityStream()
    const location = GameService.getLocationStream()
    return {
      mainEntity,
      location,
      locationInventory: GameService.getInventoryStream(location),
      structures: GameService.getStructuresIdsStream(),
    }
  },
})
</script>

<style scoped lang="scss">
.location-panel {
  @media (orientation: portrait) {
    min-width: 0;
  }
}
</style>
