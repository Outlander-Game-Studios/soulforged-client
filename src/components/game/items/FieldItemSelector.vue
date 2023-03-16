<template>
  <div>
    <Modal
      dialog
      v-if="selectingItem"
      title="Select item"
      @close="selectingItem = null"
    >
      <div class="select-tool">
        <ItemSelector
          :filter="itemFilter"
          @selected="selectItem($event)"
          v-slot="{ item }"
        >
        </ItemSelector>
      </div>
    </Modal>
    <ItemIcon
      v-if="compact"
      :size="size"
      :icon="selectedItem && selectedItem.icon"
      :amount="selectedItem && selectedItem.amount"
      :quality="selectedItem && selectedItem.quality"
      :condition="selectedItem && selectedItem.durabilityStage"
      :topRightText="topRightText"
      class="interactive"
      @click="selectingItem = true"
    >
    </ItemIcon>
    <ListItem v-else>
      <template v-slot:icon>
        <ItemIcon
          :size="size"
          :icon="selectedItem && selectedItem.icon"
          :amount="selectedItem && selectedItem.amount"
          :quality="selectedItem && selectedItem.quality"
          :condition="selectedItem && selectedItem.durabilityStage"
          class="interactive"
          @click="selectingItem = true"
        />
      </template>
      <template v-slot:title>
        <RichText :value="selectedItem && selectedItem.name" />
      </template>
      <template v-slot:subtitle>
        <slot :item="selectedItem" />
      </template>
      <template v-slot:buttons>
        <Button @click="selectingItem = true">Change</Button>
      </template>
    </ListItem>
  </div>
</template>

<script>
export default {
  props: {
    compact: {
      type: Boolean,
    },
    size: {
      default: 6,
    },
    itemFilter: {
      required: true,
    },
    value: {},
    topRightText: {},
  },

  data: () => ({
    selectingItem: false,
  }),

  subscriptions() {
    const rootEntityStream = GameService.getRootEntityStream();
    return {
      playerInventory: GameService.getInventoryStream(
        rootEntityStream
      ).map((inventory) => inventory.toObject((item) => item.id)),
    };
  },

  computed: {
    selectedItem() {
      if (!this.playerInventory) {
        return null;
      }
      return this.playerInventory[this.value];
    },
  },

  methods: {
    selectItem(item) {
      this.$emit("input", item && item.id);
      this.selectingItem = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
