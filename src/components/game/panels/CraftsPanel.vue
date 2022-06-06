<template>
  <div>
    <Header>Crafts</Header>
    <div v-if="!crafts">
      <LoadingPlaceholder />
    </div>
    <div v-else-if="!crafts.length" class="empty-text">None</div>
    <div v-else v-for="craft in crafts">
      <CraftListItem :craft="craft" />
    </div>
  </div>
</template>

<script>
export default {
  subscriptions() {
    return {
      crafts: GameService.getCraftsStream(),
    };
  },
};
</script>
