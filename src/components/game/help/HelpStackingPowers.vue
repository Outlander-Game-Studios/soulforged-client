<template>
  <span>
    <LoadingPlaceholder v-if="!powersInfo" />
    <span v-else>
      <p>
        Each power you purchase increases the cost of all subsequent power purchases by a fixed
        amount for your current character.
      </p>
      <p>
        You currently have purchased
        <em>{{ powersInfo.currentLevel }}</em>
        {{ powersInfo.currentLevel === 1 ? 'power' : 'powers' }}.
      </p>
      <p>
        Because of this the next power you purchase will have
        <span v-if="powersInfo.currentTax">
          added cost of
          <CurrencyDisplay :value="powersInfo.currentTax" inline />
        </span>
        <span v-else>no added cost.</span>
        <br />
        After that purchase, the following power will have an added cost of
        <CurrencyDisplay :value="powersInfo.nextTax" inline />
      </p>
    </span>
  </span>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      powersInfo: Rx.fromPromise(GameService.requestPowersInfo()),
    }
  },
})
</script>
