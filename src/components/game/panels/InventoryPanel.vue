<template>
  <div>
    <CharacterEquipmentPanel />
    <Inventory :inventory="playerInventory" includeCrafts includeUnequipDrop>
      <Header>Inventory</Header>
      <CarryCapacityIndicator />
    </Inventory>
    <Inventory :inventory="locationInventory" includeCrafts>
      <Header>Location Inventory</Header>
    </Inventory>
  </div>
</template>

<script>
export default {
  subscriptions() {
    const mainEntity = GameService.getRootEntityStream();
    const location = GameService.getLocationStream();
    return {
      mainEntity,
      location,
      playerInventory: GameService.getInventoryStream(mainEntity),
      locationInventory: GameService.getInventoryStream(location),
    };
  },
};
</script>
