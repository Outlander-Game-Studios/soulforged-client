<template>
  <div>
    <CharacterEquipmentPanel />
    <Inventory
      :inventory="playerInventory"
      includeCrafts
      includeUnequipDrop
      header="Inventory"
      searchControlEvent="search-inventory"
    >
      <CarryCapacityIndicator />
    </Inventory>
    <Inventory
      :inventory="locationInventory"
      includeCrafts
      header="Location Inventory"
      searchControlEvent="search-location-inventory"
    >
    </Inventory>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    const mainEntity = GameService.getRootEntityStream()
    const location = GameService.getLocationStream()
    return {
      mainEntity,
      location,
      playerInventory: GameService.getInventoryStream(mainEntity),
      locationInventory: GameService.getInventoryStream(location),
    }
  },
})
</script>
