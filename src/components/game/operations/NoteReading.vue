<template>
  <div class="note-reading">
    <CloseButton class="close-button" @click="cancel()" />
    <Header>Note</Header>
    <Spaced>
      <LanguageIncluded :value="operation.context.text" />
    </Spaced>
  </div>
</template>

<script>
const OperationNoteReading = {
  props: {
    operation: {},
  },

  methods: {
    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION)
    },
  },
}
window.OperationNoteReading = OperationNoteReading
export default OperationNoteReading
</script>

<style scoped lang="scss">
.note-reading {
  @media (orientation: landscape) {
    max-width: calc(0.5 * var(--app-width));
  }

  @media (orientation: portrait) {
    max-width: calc(0.9 * var(--app-width));
  }
}
</style>
