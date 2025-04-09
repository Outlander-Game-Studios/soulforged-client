<template>
  <Modal dialog @close="$emit('close')">
    <template v-slot:title> Game credits </template>
    <template v-slot:contents>
      <div class="credits-container">
        <LoadingPlaceholder v-if="!credits" />
        <Vertical v-else>
          <template v-for="credit in credits">
            <Header alt2>{{ credit.section }}</Header>
            <div class="names">
              <div v-for="name in credit.names" v-html="name" />
            </div>
          </template>
        </Vertical>
      </div>
    </template>
  </Modal>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      credits: Rx.fromPromise(GameService.fetcher('/api/credits')),
    }
  },
})
</script>

<style scoped lang="scss">
.names {
  text-align: center;
}

.credits-container {
  min-width: 28rem;
}
</style>
