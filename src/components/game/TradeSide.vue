<template>
  <div
    class="trade-side"
    v-if="tradeSideData"
    :class="{ 'my-side': mySide, accepted: tradeSideData.accepted }"
  >
    <div class="side-header">
      <div class="header-and-currency">
        <div class="name-text">
          {{ creature && creature.name }}
        </div>
      </div>
      <Avatar
        :class="{ absent: !characterPresent(creature) }"
        :creature="creature"
        size="small"
        headOnly
        :flipped="!mySide"
        :variant="ENTITY_VARIANTS.TRADE"
      />
    </div>
    <HorizontalFill>
      <Actions
        v-if="mySide"
        :target="trade"
        actionId="setEssence"
        :disabled="!trade.canUpdate"
        vertical
      >
        <template v-slot:setEssence>
          <HorizontalFill tight class="interactive">
            <Container
              :borderSize="0.25"
              class="currency-container flex-grow"
              backgroundType="alt"
            >
              <CurrencyDisplay
                :value="tradeSideData.essence"
                :flipped="mySide"
              />
            </Container>
            <Icon
              class="set-essence-icon"
              :class="{ disabled: !trade.canUpdate }"
              :src="plusIcon"
              :size="2.6"
              backgroundType="alt"
            />
          </HorizontalFill>
        </template>
      </Actions>
      <Container
        v-else
        :borderSize="0.25"
        class="currency-container"
        backgroundType="alt"
      >
        <CurrencyDisplay :value="tradeSideData.essence" :flipped="mySide" />
      </Container>
    </HorizontalFill>
    <div class="items">
      <div v-for="(item, idx) in tradeSideData.items" :key="idx">
        <Actions
          v-if="mySide"
          :target="trade"
          actionId="removeItem"
          :parameterValues="{ itemIdentifier: item.identifier }"
          :disabled="!trade.canUpdate"
        >
          <template v-slot:removeItem>
            <ItemIcon
              :icon="item.icon"
              :amount="item.amount"
              :condition="item.durabilityStage"
              :quality="item.quality"
              :class="{ interactive: trade.canUpdate }"
              :size="4.5"
            />
          </template>
        </Actions>
        <div v-else>
          <ItemIcon
            :icon="item.icon"
            :amount="item.amount"
            :condition="item.durabilityStage"
            :quality="item.quality"
            :size="4.5"
          />
        </div>
      </div>
      <Actions
        :target="trade"
        actionId="addItem"
        :disabled="!trade.canUpdate"
        v-if="mySide"
      >
        <template v-slot:addItem>
          <Icon
            class="add-item-icon interactive"
            :class="{ disabled: !trade.canUpdate }"
            :src="plusIcon"
            :size="4.5"
            backgroundType="alt"
          />
        </template>
      </Actions>
    </div>
  </div>
</template>

<script>
import plusIcon from "../../assets/ui/cartoon/icons/plus_nobg.png";

export default {
  props: {
    trade: {},
    tradeSide: {},
    mySide: {
      type: Boolean,
    },
  },

  data: () => ({
    ENTITY_VARIANTS,
    plusIcon,
  }),

  computed: {
    tradeSideData() {
      return this.trade[this.tradeSide];
    },
  },

  subscriptions() {
    return {
      creature: this.$stream("tradeSideData")
        .pluck("who")
        .switchMap((id) =>
          GameService.getEntityStream(id, ENTITY_VARIANTS.TRADE)
        ),
      creaturesAtLocation: GameService.getLocationStream().map((location) =>
        location.creatures.toObject((cId) => cId)
      ),
    };
  },

  methods: {
    characterPresent(creature) {
      return (
        creature &&
        this.creaturesAtLocation &&
        this.creaturesAtLocation[creature.id]
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.trade-side {
  width: 50%;
  padding: 0.2rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);

  .name-text {
    white-space: nowrap;
    text-align: center;
    height: 3rem;
    line-height: 3rem;
    font-size: 75%;
    color: #4e2000;
  }

  &.accepted {
    background: limegreen;
    box-shadow: 0 0 4rem 2rem inset green;
    border: 1px solid black;
    box-sizing: border-box;
  }

  .items {
    padding: 1.5rem 0.5rem 0.5rem;
    display: flex;
    flex-wrap: wrap;
  }

  .side-header {
    display: flex;
    max-width: 100%;

    .header-and-currency {
      flex-grow: 1;
      overflow: hidden;
    }
  }

  &.my-side {
    .items {
      flex-direction: row-reverse;
    }

    .side-header {
      flex-direction: row-reverse;
    }
  }

  .disabled {
    @include filter(saturate(0));
  }
}

.currency-container {
  padding: 0.4rem 0 0;
  flex-grow: 1;
  font-size: 75%;
  height: 3rem;
}

.set-essence-icon {
  width: 2.6rem;
  max-width: 2.6rem;
}

.absent {
  opacity: 0.4;
}
</style>
