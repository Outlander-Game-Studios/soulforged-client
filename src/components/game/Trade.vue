<template>
  <Container class="trade-component" borderType="alt3">
    <div
      class="sides"
      :class="{ concluded: trade.cancelled || trade.completed }"
    >
      <TradeSide :trade="trade" tradeSide="me" mySide />
      <div class="spacing"></div>
      <TradeSide :trade="trade" tradeSide="them" />
    </div>
    <Spaced>
      <transition name="fade-expand">
        <HorizontalCenter v-if="errors && errors.length">
          <div class="errors-block">
            Last trade attempt failed:
            <div v-for="(error, idx) in errors" class="error" :key="idx">
              {{ error }}
            </div>
          </div>
        </HorizontalCenter>
      </transition>
      <div v-if="trade.cancelled || trade.completed" class="concluded-section">
        <div v-if="trade.cancelled" class="text bad">Trade cancelled</div>
        <div v-else class="text good">Trade completed</div>
        <Actions :target="trade" actionId="dismissTrade" />
      </div>
      <HorizontalCenter v-else>
        <Actions
          :target="trade"
          actionId="toggleAcceptTrade"
          :disabled="!trade.me.accepted && !trade.canAccept"
        >
          <template v-slot:toggleAcceptTrade>
            <Button v-if="trade.me.accepted">Hold off</Button>
            <Button
              v-else
              type="accept"
              :processing="!trade.canUpdate || !trade.canAccept"
            >
              Accept
            </Button>
          </template>
        </Actions>
        <Actions
          :target="trade"
          actionId="cancelTrade"
          :disabled="!trade.canUpdate"
        >
          <template v-slot:cancelTrade>
            <Button type="reject" :disabled="!trade.canUpdate">Cancel</Button>
          </template>
        </Actions>
      </HorizontalCenter>
    </Spaced>
  </Container>
</template>

<script>
export default {
  props: {
    trade: {},
  },

  subscriptions() {
    return {
      me: GameService.getMyCreatureStream(),
      them: this.$stream("trade")
        .pluck("them")
        .switchMap((id) => GameService.getEntityStream(id)),
      errors: this.$stream("trade").pluck("errors"),
    };
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";
.trade-component {
  margin: 0.1rem;

  .sides {
    display: flex;

    &.concluded {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  .spacing {
    flex-grow: 1;
  }
}

.errors-block {
  padding: 1rem;
  background: #fdd;
  color: #540000;
  margin: 0.5rem;
  z-index: 25;
  border-radius: 1rem;
  border: 1px solid #540000;
  font-size: 75%;
}

.concluded-section {
  display: flex;
  justify-content: center;
  white-space: nowrap;

  .text {
    padding: 0 1rem;
    line-height: 4.5rem;
    font-style: italic;
    font-weight: bold;
    font-size: 105%;

    &.good {
      @include text-good();
    }
    &.bad {
      @include text-bad();
    }
  }
}
.error {
  font-style: italic;
}
</style>
