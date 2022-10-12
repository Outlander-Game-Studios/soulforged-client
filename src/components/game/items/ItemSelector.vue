<template>
  <div>
    <LoadingPlaceholder v-if="!filteredInventory" />
    <div v-if="!filteredInventory.length" class="empty-text">
      Nothing to select from
    </div>
    <Vertical v-if="$scopedSlots.default">
      <ListItem :iconSrc="crossIcon" flexible v-if="includeNone">
        <template v-slot:title> </template>
        <template v-slot:subtitle> </template>
        <template v-slot:buttons>
          <Button @click="selectedItem(null)">Select none</Button>
        </template>
      </ListItem>
      <div
        v-if="filteredInventory.length > 0"
        v-for="(item, idx) in filteredInventory"
        :key="idx"
      >
        <ListItem :iconSrc="item.icon" flexible>
          <template v-slot:icon>
            <ItemIcon
              :size="6"
              :icon="item.icon"
              :amount="item.amount"
              :quality="item.quality"
              :condition="item.durabilityStage"
              :isEquipped="equipmentMap && equipmentMap[item.id]"
            />
          </template>
          <template v-slot:title>
            <RichText :value="item.name" />
          </template>
          <template v-slot:subtitle>
            <slot :item="item" />
          </template>
          <template v-slot:buttons>
            <Button @click="selectedItem(item)">Select</Button>
          </template>
        </ListItem>
      </div>
      <slot name="extras" />
    </Vertical>
    <HorizontalWrap v-else tight>
      <div class="item-button" @click="selectedItem(null)" v-if="includeNone">
        <ItemIcon :size="size" :icon="crossIcon" />
      </div>
      <div
        v-if="filteredInventory.length > 0"
        v-for="(item, idx) in filteredInventory"
        :key="idx"
        class="item-button"
        :class="{ selected: internalValue && internalValue.id === item.id }"
        @click="selectedItem(item)"
      >
        <ItemIcon
          :size="size"
          :icon="item.icon"
          :amount="item.amount"
          :quality="item.quality"
          :condition="item.durabilityStage"
          :isEquipped="equipmentMap && equipmentMap[item.id]"
        />
      </div>
      <slot name="extras" />
    </HorizontalWrap>
  </div>
</template>

<script>
import crossIcon from "../../../assets/ui/cartoon/icons/cross.jpg";

export default {
  props: {
    size: {
      default: 8,
    },
    inventory: {
      type: Array,
    },
    filter: {
      default: () => () => true,
    },
    includeNone: {
      type: Boolean,
      default: true,
    },
    includeLocation: {
      type: Boolean,
      default: false,
    },
    label: {},
  },

  data: () => ({
    crossIcon,
    internalValue: null,
  }),

  subscriptions() {
    const rootEntityStream = GameService.getRootEntityStream();
    const locationStream = GameService.getLocationStream();
    return {
      itemSorter: GameService.getItemSorterStream(),
      equipmentMap: GameService.getEquipmentMapStream(),
      playerInventory: this.$stream("includeLocation")
        .switchMap((includeLocation) => {
          const entityStream = GameService.getInventoryStream(rootEntityStream);
          return includeLocation
            ? Rx.combineLatest(
                entityStream,
                GameService.getInventoryStream(locationStream)
              ).map(([character, location]) => [...character, ...location])
            : entityStream;
        })
        .tap((inventory) => {
          if (this.internalValue) {
            const item = inventory.find((i) => i.id === this.internalValue.id);
            if (item) {
              this.selectedItem(item);
            }
          }
        }),
    };
  },

  computed: {
    filteredInventory() {
      return (
        this.playerInventory
          ?.filter(this.filter)
          .filter((item) => !!item)
          .sort(this.itemSorter) || []
      );
    },
  },

  methods: {
    selectedItem(item) {
      this.internalValue = item;
      console.log("Selected item", JSON.stringify(item));
      this.$emit("selected", item);
      this.$emit("input", item);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.item-button {
  @include interactive();

  &.selected {
    @include filter(
      saturate(1.1) brightness(1.5) drop-shadow(0.2rem 0.2rem 0.2rem black)
    );
    z-index: 3;
  }
}
</style>
