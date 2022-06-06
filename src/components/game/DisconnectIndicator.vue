<template>
  <transition name="fade-slide">
    <div v-if="disconnected" class="disconnect-container">
      <Container
        :borderSize="1"
        borderType="alt"
        backgroundType="alt2"
        class="interactive"
        @click="onClick()"
      >
        <div class="disconnect-indicator flex">
          <Icon
            round
            :size="6"
            :src="connectionIcon"
            backgroundType="alt"
            class="disconnect-icon"
          />
          <Description>
            <div class="disconnect-text">
              Connection lost<br />
              Click to refresh the page
            </div>
          </Description>
        </div>
      </Container>
    </div>
  </transition>
</template>

<script>
import connectionIcon from "../../assets/ui/cartoon/icons/connection2.jpg";

export default {
  data: () => ({
    connectionIcon,
  }),

  subscriptions() {
    return {
      disconnected: GameService.getDisconnectionDetectedStream(),
    };
  },

  methods: {
    onClick() {
      window.location.reload();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.disconnect-container {
  @include filter-fix();
  display: flex;
  width: 100%;
  top: 1rem;
  position: fixed;
  z-index: 90009000;
  justify-content: center;
  pointer-events: none;
  > * {
    pointer-events: all;
  }

  &.fade-slide-enter-active {
    transition-duration: 0.8s;
  }
  &.fade-slide-leave-active {
    transition-duration: 0.2s;
  }
}

.disconnect-indicator {
  .disconnect-icon {
    padding: 0.5rem;
    animation: blink 1s infinite;
  }
}

.disconnect-text {
  text-align: center;
  font-weight: bold;
  padding: 1rem;
  font-size: 110%;
  line-height: 2.4rem;
}
</style>
