<template>
  <div class="dead-frame">
    <AutoSizer />
    <div class="dead-text-wrapper">
      <div class="dead-text">
        <div class="you-died">You died</div>
        <div class="reason" v-if="rootEntity">
          {{ rootEntity.deathReason }}
        </div>
        <Button @click="continueAfterDeath()">Continue</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default rxComponent({
  subscriptions() {
    return {
      rootEntity: GameService.getRootEntityStream(),
    }
  },

  methods: {
    continueAfterDeath() {
      GameService.request(REQUEST_CODES.CONFIRM_DEATH).then(() => {
        location.reload(true)
      })
    },

    redirectToGame() {
      window.location.hash = '/main'
    },
  },

  created() {
    this.interval = setInterval(() => {
      GameService.getRootEntityStream()
        .first()
        .subscribe((entity) => {
          if (!entity || !entity.dead) {
            this.redirectToGame()
          }
        })
    }, 3000)
  },

  destroyed() {
    clearInterval(this.interval)
  },
})
</script>

<style scoped lang="scss">
@keyframes you-died {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes you-died-scroll-up {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, -10vh);
  }
}

@keyframes dead-button-continue {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.dead-frame {
  text-align: center;
  color: red;
  background: black;
  text-transform: uppercase;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99001;

  .you-died {
    font-size: 18vmin;
  }

  .dead-text-wrapper {
    padding: 40vh 0 0;
    animation: you-died-scroll-up 1s ease-in 1 both;
    animation-delay: 4.5s;
  }

  .dead-text,
  .reason {
    animation: you-died 3s ease-in-out 1 both;
  }

  .reason {
    font-size: 8vmin;
    animation-delay: 1s;
  }

  button {
    margin-top: 5vh;
    animation: dead-button-continue 0.6s ease-in-out 1 both;
    animation-delay: 5.7s;
  }
}
</style>
