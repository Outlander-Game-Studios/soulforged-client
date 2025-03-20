<template>
  <transition name="fade">
    <div v-if="disconnected" class="disconnect-container" :class="'stage-' + disconnected">
      <Container
        :borderSize="1"
        borderType="alt"
        backgroundType="alt2"
        class="interactive container"
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
import connectionIcon from '../../assets/ui/cartoon/icons/connection2.jpg'

export default {
  data: () => ({
    connectionIcon,
  }),

  subscriptions() {
    return {
      disconnected: GameService.getDisconnectionDetectedStream(),
    }
  },

  methods: {
    onClick() {
      window.location.reload()
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.disconnect-container {
  @include utils.filter-fix();
  display: flex;
  width: 100%;
  position: fixed;
  z-index: 90009000;
  pointer-events: none;
  > * {
    pointer-events: all;
  }

  top: 1rem;
  left: 1rem;
  justify-content: flex-start;

  &.stage-1 {
    @media (orientation: landscape) {
      .container {
        border-color: transparent;
        border-image: none;
        background: none;
        pointer-events: none;
      }

      .disconnect-text {
        display: none;
      }

      .disconnect-icon {
        transform: scale(0.5);
      }
    }

    @media (orientation: portrait) {
    }
  }
  &.stage-2 {
  }

  &.fade-enter-active {
    transition-duration: 1s;
  }
  &.fade-leave-active {
    transition-duration: 0.2s;
  }
}

.disconnect-indicator {
  .disconnect-icon {
    transition: transform 0.2s linear;
    padding: 0.5rem;
    animation: blink 1s infinite;
    transform-origin: top left;
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
