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
import exclamationIcon from "../operation-assets/exclamation.png";

export default window.OperationNoteReading = {
  props: {
    operation: {},
  },

  methods: {
    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },
  },
};
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
