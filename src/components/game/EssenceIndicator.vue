<template>
  <div v-if="knowledgeBase" class="relative interactive" @click="mouseClick()">
    <Container
      v-if="knowledgeBase.essence !== undefined"
      :borderSize="0.5"
      class="currency-display"
      backgroundType="alt"
    >
      <CurrencyDisplay :value="knowledgeBase.essence" short />
      <EssenceModal v-if="showDialog" @close="showDialog = false" />
    </Container>
    <div v-if="knowledgeBase.pendingEssence" class="more-essence" />
  </div>
</template>

<script>
import pageSound from '../../assets/sounds/page.mp3'

export default rxComponent({
  data: () => ({
    showDialog: false,
  }),

  subscriptions() {
    return {
      knowledgeBase: GameService.getKnowledgeBaseStream(),
    }
  },

  methods: {
    mouseClick() {
      SoundService.playSound(pageSound)
      this.showDialog = true
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.currency-display {
  height: 3.5rem !important;
  overflow: hidden !important;
  display: flex;
  padding: 0.35rem 0.5rem;
  font-size: 85%;
}

.more-essence {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 2rem;
  height: 4rem;
  transform: rotate(10deg);
  pointer-events: none;
  background-image: utils.ui-asset('/icons/exclamation.png');
  background-size: auto 100%;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
