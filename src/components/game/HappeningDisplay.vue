<template>
  <div v-if="mainEntity && mainEntity.happening" :key="mainEntity.happening.title">
    <Modal dialog large specialFrame darkBackdrop>
      <template v-slot:title> {{ mainEntity.happening.title }} </template>
      <template v-slot:contents>
        <Spaced class="happening-container">
          <Vertical>
            <img
              v-if="mainEntity.happening.image"
              class="banner"
              :src="mainEntity.happening.image"
            />
            <Description prominent class="center">
              <RichText :value="mainEntity.happening.description" html />
            </Description>
            <HorizontalCenter>
              <Button
                v-for="label in mainEntity.happening.options"
                :key="label"
                @click="selectOption(label)"
              >
                {{ label }}
              </Button>
            </HorizontalCenter>
          </Vertical>
        </Spaced>
      </template>
    </Modal>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
    }
  },

  methods: {
    selectOption(optionLabel) {
      GameService.triggerExecutor('Happening', 'selectOption', {
        label: optionLabel,
      })
    },
  },
})
</script>

<style scoped lang="scss">
.banner {
  margin: 0 auto;
  max-width: calc(0.7 * var(--app-width));
  max-height: calc(0.45 * var(--app-height));
}

.center {
  text-align: center;
}

.happening-container {
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
