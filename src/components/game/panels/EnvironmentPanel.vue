<template>
  <div v-if="effects && effects.length" class="environment-panel">
    <Header @click="details = true" class="interactive"> Environment </Header>
    <div v-if="!effects.length" class="empty-text">None</div>
    <HorizontalWrap tight class="scroll-spacing">
      <EffectIcon
        v-for="(effect, idx) in effects"
        :key="idx"
        :effect="effect"
        :size="6"
        class="interactive"
        @click="details = effect"
      />
    </HorizontalWrap>
    <Modal v-if="details" dialog large @close="details = false">
      <template v-slot:title> Environment </template>
      <template v-slot:contents>
        <Effects :effects="details === true ? effects : [details]" />
      </template>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    location: {},
  },

  data: () => ({
    details: false,
  }),

  subscriptions() {
    return {
      effects: GameService.getRootEntityStream().pluck("environment"),
    };
  },
};
</script>

<style scoped lang="scss"></style>
