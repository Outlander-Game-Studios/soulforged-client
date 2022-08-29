<template>
  <div v-if="mainEntity && mainEntity.happening">
    <Modal dialog large specialFrame>
      <template v-slot:title> {{ mainEntity.happening.title }} </template>
      <template v-slot:contents>
        <Spaced>
          <Vertical>
            <img class="banner" :src="mainEntity.happening.image" />
            <Description>
              {{ mainEntity.happening.description }}
            </Description>
            <HorizontalCenter>
              <Button
                v-for="label in mainEntity.happening.options"
                :key="label"
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
export default {
  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
    };
  },
};
</script>

<style scoped lang="scss">
.banner {
  margin: 0 auto;
  max-width: calc(0.7 * var(--app-width));
  max-height: calc(0.45 * var(--app-height));
}
</style>
