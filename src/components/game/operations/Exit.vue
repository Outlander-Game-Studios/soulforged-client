<template>
  <div class="exit-operation">
    <CloseButton class="close-button" @click="cancel()" />
    <Header>Exit Instance</Header>
    <Spaced>
      <Vertical>
        <HorizontalCenter>
          <Description prominent>Are you sure you want to leave?</Description>
        </HorizontalCenter>
        <HorizontalCenter>
          <Description warning>
            You won't be able to return to this instance.
          </Description>
        </HorizontalCenter>
        <Button @click="commence()">Leave</Button>
      </Vertical>
    </Spaced>
  </div>
</template>

<script>
export default window.OperationExit = {
  props: {
    operation: {},
  },

  data: () => ({}),

  methods: {
    commence() {
      GameService.request(REQUEST_CODES.COMMENCE_OPERATION).then(
        ({ statusChanges = [] } = {}) => {
          ToastNotify(statusChanges);
        }
      );
    },

    cancel() {
      GameService.request(REQUEST_CODES.CANCEL_OPERATION);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.explore-operation {
  min-width: 30rem;
}
</style>
