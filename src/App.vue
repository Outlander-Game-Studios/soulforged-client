<template>
  <div id="app">
    <Container
      v-if="invalidClientVersion"
      :top="false"
      :left="false"
      :right="false"
      :bottom="false"
    >
      <Modal dialog>
        <template v-slot:title> Game client out of date </template>
        <template v-slot:contents>
          <Spaced>
            <Description>
              <div>It appears that this client is out of date.</div>
              <div>Please refresh the page to update your client.</div>
              <div>
                If that doesn't work please let us know on the
                <a href="https://discord.gg/XExbewT5GQ" target="_blank">Discord</a>.
              </div>
              <hr />
              <div>Debug info: {{ startupId }} vs {{ currentRev }}</div>
            </Description>
          </Spaced>
        </template>
      </Modal>
    </Container>
    <router-view v-else />
    <ToastNotifications />
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    const clientStartupId = GameService.getClientStartupId()
    const startupIdStream = GameService.getStartupIdStream()
    const skipIntegrity = this?.$route?.query?.skipIntegrityCheck !== undefined
    return {
      startupId: startupIdStream.tap((startupId) => {
        console.log('Startup ID:', startupId, skipIntegrity)
        console.log('Client ver:', clientStartupId)
      }),
      currentRev: Rx.Observable.of(clientStartupId),
      invalidClientVersion: startupIdStream.map(
        (startupId) =>
          !skipIntegrity && `${startupId}` !== 'dev' && `${startupId}` !== `${clientStartupId}`,
      ),
    }
  },

  created() {},
})
</script>

<style scoped lang="scss">
.invalid-version-wrapper {
  padding: 25%;
}
</style>
