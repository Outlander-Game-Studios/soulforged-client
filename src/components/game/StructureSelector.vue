<template>
  <div v-if="!filteredStructures || filteredStructures.length === 0" class="empty-text">
    Nothing to select from
  </div>
  <div v-else>
    <Vertical v-if="$slots.default">
      <div v-for="(structure, idx) in filteredStructures" :key="idx">
        <ListItem :iconSrc="structure.icon">
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
    <Vertical v-else>
      <LabeledValue v-if="withText" label="Selected">
        <RichText v-if="internalValue" :value="internalValue.name" />
        <Description v-else warning inline> None </Description>
      </LabeledValue>
      <HorizontalWrap tight>
        <div v-if="includeEmpty" class="item-button" @click="selectedItem(null)">
          <ItemIcon :size="size" />
        </div>
        <div
          v-for="(structure, idx) in filteredStructures"
          :key="idx"
          class="item-button"
          @click="selectedStructure(structure)"
          :class="{
            selected: internalValue && internalValue.id === structure.id,
          }"
        >
          <StructureIcon :size="size" :structure="structure" />
        </div>
      </HorizontalWrap>
    </Vertical>
  </div>
</template>

<script>
export default rxComponent({
  props: {
    includeEmpty: {
      default: true,
    },
    inventory: {
      type: Array,
    },
    withText: {
      type: Boolean,
      default: false,
    },
    filter: {
      default: () => () => true,
    },
    label: {},
    size: {
      default: 8,
    },
  },

  data: () => ({
    internalValue: null,
  }),

  subscriptions() {
    return {
      structures: GameService.getLocationStream()
        .map((location) => location.structures)
        .switchMap((ids) => GameService.getEntitiesStream(ids))
        .map((structures) => structures.sort(structureSorter)),
    }
  },

  computed: {
    filteredStructures() {
      return this.structures?.filter(this.filter) || []
    },
  },

  methods: {
    selectedStructure(structure) {
      this.internalValue = structure
      this.$emit('selected', structure)
      this.$emit('update:value', structure)
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.item-button {
  @include utils.interactive();

  &.selected {
    z-index: 3;
    @include utils.filter(saturate(1.1) brightness(1.5) drop-shadow(0.2rem 0.2rem 0.2rem black));
  }
}
</style>
