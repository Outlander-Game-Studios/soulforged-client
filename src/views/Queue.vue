<template>
  <div class="queue-wrapper">
    <AutoSizer />
    <Modal dialog large>
      <template v-slot:title> Login queue </template>
      <template v-slot:contents>
        <Spaced>
          <Vertical>
            <Description class="desc">
              We are currently experiencing a large number of players trying to access the game. You
              have been placed in the queue, please keep this window open to stay in the queue.
            </Description>
            <div class="place">
              <span class="place-label">
                Your place in queue:
                <em v-if="queuePosition">{{ queuePosition }}</em>
                <Spinner v-else color="#964500" :size="1.5" />
              </span>
            </div>
          </Vertical>
        </Spaced>
      </template>
    </Modal>
  </div>
</template>

<script>
export default rxComponent({
  data: () => ({
    queuePosition: GameService.queuePosition,
  }),

  subscriptions() {
    return {}
  },

  created() {
    if (!this.queuePosition) {
      this.retry()
    }
    setInterval(
      () => {
        this.retry()
      },
      30 * SECONDS * IN_MILISECONDS,
    )
  },

  methods: {
    retry() {
      console.log('Retrying...')
      this.queuePosition = null
      GameService.getOpenPromise(true, true)
        .then(() => {
          console.log('Connected')
          SoundService.playNotificationSound('login')
          window.location = '/#/main'
        })
        .catch(() => {
          console.log('Still in queue', GameService.queuePosition)
          this.queuePosition = GameService.queuePosition
        })
    },
  },
})
</script>

<style scoped lang="scss">
@use '../utils.scss';

.queue-wrapper {
  padding: 3rem;
  box-sizing: border-box;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  background-image: url(ui-asset('/backdrops/main.jpg', 'src/'));
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
}
.place-label {
  color: #555;

  em {
    color: black;
    font-weight: bold;
  }
}
.place {
  text-align: center;
}
.desc {
  max-width: 40rem;
}
</style>
