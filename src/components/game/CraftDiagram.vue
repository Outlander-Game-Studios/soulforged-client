<template>
  <div>
    <component v-if="craft" :is="wrap ? 'HorizontalWrap' : 'Horizontal'" tight>
      <ItemIcon
        v-for="(material, idx) in craft.materials"
        :key="'in' + idx"
        :icon="material.itemDef.icon"
        :size="size"
        :class="{ interactive: !nonInteractive }"
        @click="showCrafts(material)"
      >
        <template #amount>
          <ItemCountNeeded
            v-if="includeInventory"
            :needed="material.amount * finalAmount"
            :publicId="material.publicId"
          />
          <div v-else>{{ material.amount * finalAmount }}</div>
        </template>
      </ItemIcon>
      <div
        class="arrow"
        :style="{
          'font-size': size * 1 + 'rem',
          'line-height': size * 1 + 'rem',
          height: size * 1 + 'rem',
        }"
      >
        ➭
      </div>
      <ItemCollectAnimation
        v-for="(produce, idx) in craft.produce"
        :ref="'produce_' + produce.publicId"
        :key="'produce_' + produce.publicId"
        :icon="produce.itemDef.icon"
        :size="size"
        :class="{ interactive: !nonInteractive }"
        @click="showCrafts(produce)"
      >
        <template #amount>
          <div class="amount">
            <ItemCountNeeded
              v-if="includeInventory"
              :needed="produce.amount * finalAmount"
              :publicId="produce.publicId"
              noFlash
            />
            <div v-else>{{ produce.amount * finalAmount }}</div>
          </div>
        </template>
      </ItemCollectAnimation>
    </component>
    <LoadingPlaceholder v-else />
    <Modal
      dialog
      large
      v-if="showItemCraftsByItem"
      @close="showItemCraftsByItem = null"
    >
      <template v-slot:title>
        <Horizontal>
          <div class="header-text">
            <RichText :value="showItemCraftsByItem.itemDef.name" /> - Related
            Recipes
          </div>
        </Horizontal>
      </template>
      <template v-slot:contents>
        <HorizontalFill>
          <div v-if="craftsByMaterialPublicId.length">
            <Header alt2> As material </Header>
            <div v-for="craft in craftsByMaterialPublicId">
              <CraftListItem :craft="craft" @action="actioned()" />
            </div>
          </div>
          <div v-if="craftsByProducePublicId.length">
            <Header alt2> As product </Header>
            <div v-for="craft in craftsByProducePublicId">
              <CraftListItem :craft="craft" @action="actioned()" />
            </div>
          </div>
        </HorizontalFill>
      </template>
    </Modal>
  </div>
</template>

<script>
import { formatNumber } from "../../../common/utils/misc.js";
import Horizontal from "../layouts/Horizontal";

export default {
  components: { Horizontal },
  props: {
    craft: {},
    amount: {
      default: 1,
    },
    size: {
      default: 3,
    },
    includeInventory: {
      type: Boolean,
      default: false,
    },
    nonInteractive: {
      type: Boolean,
      default: false,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    showItemCraftsByItem: null,
  }),

  subscriptions() {
    const filteredCrafts = (filter) =>
      this.$stream("showItemCraftsByItem").switchMap((item) =>
        item?.publicId
          ? GameService.getCraftsStream().map((crafts) =>
              crafts.filter(filter(item?.publicId))
            )
          : Rx.Observable.of([])
      );

    return {
      craftsByMaterialPublicId: filteredCrafts((publicId) => (craft) =>
        craft.materials.some((material) => material.publicId === publicId)
      ),
      craftsByProducePublicId: filteredCrafts((publicId) => (craft) =>
        craft.produce.some((produce) => produce.publicId === publicId)
      ),
    };
  },

  computed: {
    finalAmount() {
      if (isNaN(this.amount)) {
        return 0;
      }
      return this.amount;
    },
  },

  methods: {
    actioned() {
      this.showItemCraftsByItem = null;
      this.$emit("action");
    },
    showCrafts(item) {
      if (!this.nonInteractive) {
        this.showItemCraftsByItem = item;
      }
    },

    apiAddCollected({ results, failPrefix }, selector) {
      if (!results.length) {
        return Rx.Observable.empty();
      }
      const produceAmounts = this.craft.produce.reduce(
        (acc, produce) => ({
          ...acc,
          [produce.publicId]: produce.amount,
        }),
        {}
      );
      results = results.reduce((acc, result) => {
        Object.keys(result).map((itemPublicId) => {
          acc[itemPublicId] = acc[itemPublicId] || [];
          const qtyMade =
            typeof result[itemPublicId] === "object"
              ? Object.values(result[itemPublicId]).reduce(sum, 0)
              : result[itemPublicId];
          acc[itemPublicId].push({
            gain: qtyMade,
            loss: produceAmounts[itemPublicId] - qtyMade,
          });
        });
        return acc;
      }, {});
      const streams = Object.keys(results).map((itemPublicId) => {
        const itemResults = results[itemPublicId];
        return this.$refs["produce_" + itemPublicId].first().apiAddCollected(
          {
            results: itemResults,
            failPrefix,
          },
          selector
        );
      });
      return streams.first();
    },
  },
};
</script>

<style scoped lang="scss">
.horizontal-wrap.tight {
  flex-wrap: nowrap;
}

.diagram-nowrap {
  display: flex;
  flex-wrap: nowrap;
  overflow: visible;
  width: 0;
}

.header-text {
  padding: 0.3rem 0 0;
}
</style>
