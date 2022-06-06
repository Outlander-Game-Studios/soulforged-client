<template>
  <div v-if="decorationSlots && decorationSlots.length">
    <Header>Decorations</Header>
    <template v-for="(slot, idx) in decorationSlots">
      <Header alt2> {{ slot.slotName }} </Header>
      <ListItem v-if="slot.item" :iconSrc="slot.item.icon" flexible>
        <template v-slot:title>
          <RichText :value="slot.item.name" />
        </template>
        <template v-slot:subtitle>
          <DisplayImpacts :impacts="slot.item.decorImpacts" />
        </template>
      </ListItem>
      <div v-else class="empty-text">Empty</div>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    decorationSlots() {
      if (!this.home || !this.items || !this.home.decorations) {
        return [];
      }
      return this.home.decorations.map((slot) => ({
        ...slot,
        item: this.items[slot.itemId],
      }));
    },
  },

  subscriptions() {
    const locationStream = GameService.getLocationStream();
    return {
      items: GameService.getAllItemsByIdStream(),
      home: locationStream
        .filter((location) => location?.structure)
        .switchMap((location) =>
          GameService.getEntityStream(
            location.structure,
            ENTITY_VARIANTS.DETAILS
          )
        ),
    };
  },
};
</script>

<style scoped lang="scss"></style>
