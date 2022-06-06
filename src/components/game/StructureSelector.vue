<template>
  <div v-if="filteredStructures && filteredStructures.length > 0">
    <Vertical v-if="$scopedSlots.default">
      <div
        v-if="filteredStructures.length > 0"
        v-for="(structure, idx) in filteredStructures"
        :key="idx"
      >
        <ListItem :iconSrc="structure.icon" flexible>
          <template v-slot:icon>
            <ItemIcon
              :size="6"
              :icon="structure.icon"
              :amount="structure.amount"
              :quality="structure.quality"
              :condition="structure.durabilityStage"
            />
          </template>
          <template v-slot:title>
            <RichText :value="structure.name" />
          </template>
          <template v-slot:subtitle>
            <slot :structure="structure" />
          </template>
          <template v-slot:buttons>
            <Button @click="selectedStructure(structure)">Select</Button>
          </template>
        </ListItem>
      </div>
    </Vertical>
    <HorizontalWrap v-else tight>
      <div v-if="includeEmpty" class="item-button" @click="selectedItem(null)">
        <ItemIcon :size="8" />
      </div>
      <div
        v-for="(structure, idx) in filteredStructures"
        :key="idx"
        class="item-button"
        @click="selectedStructure(structure)"
      >
        <Icon :size="8" :src="structure.icon" />
      </div>
    </HorizontalWrap>
  </div>
</template>

<script>
export default {
  props: {
    includeEmpty: {
      default: true,
    },
    inventory: {
      type: Array,
    },
    filter: {
      default: () => true,
    },
    label: {},
  },

  subscriptions() {
    return {
      structures: GameService.getLocationStream()
        .map((location) => location.structures)
        .switchMap((ids) => GameService.getEntitiesStream(ids)),
    };
  },

  computed: {
    filteredStructures() {
      return this.structures?.filter(this.filter) || [];
    },
  },

  methods: {
    selectedStructure(structure) {
      this.$emit("selected", structure);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.item-button {
  @include interactive();
}
</style>
