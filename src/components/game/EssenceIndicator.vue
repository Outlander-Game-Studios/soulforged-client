<template>
  <Container
    :borderSize="0.5"
    class="currency-display interactive"
    backgroundType="alt"
    @click="mouseClick()"
    v-if="knowledgeBase && knowledgeBase.essence !== undefined"
  >
    <CurrencyDisplay :value="knowledgeBase.essence" short />
    <PowersModal v-if="showDialog" @close="showDialog = false" />
  </Container>
</template>

<script>
import pageSound from "../../assets/sounds/page.ogg";

export default {
  data: () => ({
    showDialog: false,
  }),

  subscriptions() {
    return {
      knowledgeBase: GameService.getKnowledgeBaseStream(),
    };
  },

  methods: {
    mouseClick() {
      SoundService.playSound(pageSound);
      this.showDialog = true;
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.currency-display {
  height: 3.5rem !important;
  overflow: hidden;
  display: flex;
  padding: 0.35rem 0.5rem;
  font-size: 85%;
}
</style>
