<template>
  <div
    class="explanation-indicator"
    :style="anchorStyle"
    :class="finalPlacement"
    v-if="anchorStyle"
  >
    <div class="pointer"></div>
    <div class="text">
      <slot />
    </div>
  </div>
</template>

<script>
export default rxComponent({
  props: {
    selector: {},
    placement: {},
    landscapePlacement: {},
    portraitPlacement: {},
  },

  data: () => ({
    anchorStyle: null,
    currentScreenOrientation: null,
  }),

  subscriptions() {
    return {
      controls: ControlsService.getCurrentOpenTabStream().tap(() => {
        this.handleResize()
      }),
    }
  },

  created() {
    this.handleResize()
    this.handler = this.handleResize.bind(this)
    window.addEventListener('resize', this.handler)
  },

  destroyed() {
    window.removeEventListener('resize', this.handler)
  },

  methods: {
    handleResize(repeat) {
      if (parseInt(repeat) !== repeat) {
        repeat = 12
      }
      if (repeat === 0) {
        return
      }
      setTimeout(() => {
        this.handleResize(repeat - 1)
      }, 50)

      const screenWidth = getScreenWidth()
      const screenHeight = getScreenHeight()

      this.currentScreenOrientation = getScreenOrientation()

      const element = document.querySelector(this.selector)
      if (!element) {
        return
      }
      const boundingRect = element.getBoundingClientRect()
      switch (this.finalPlacement) {
        case 'left':
          this.anchorStyle = {
            right: `${screenWidth - boundingRect.x}px`,
            top: `${boundingRect.y + boundingRect.height / 2}px`,
          }
          return
        case 'top':
          this.anchorStyle = {
            left: `${boundingRect.x + boundingRect.width / 2}px`,
            bottom: `${screenHeight - boundingRect.y}px`,
          }
          return
        case 'top-left':
          this.anchorStyle = {
            left: `${boundingRect.x + boundingRect.width / 2}px`,
            bottom: `${screenHeight - boundingRect.y}px`,
          }
          return
        case 'bottom':
          this.anchorStyle = {
            left: `${boundingRect.x + boundingRect.width / 2}px`,
            top: `${boundingRect.y + boundingRect.height}px`,
          }
          return
        case 'right':
          this.anchorStyle = {
            left: `${boundingRect.x + boundingRect.width}px`,
            top: `${boundingRect.y + boundingRect.height / 2}px`,
          }
          return
      }
      this.anchorStyle = {
        left: `${boundingRect.x + boundingRect.width / 2}px`,
        top: `${boundingRect.y + boundingRect.height / 2}px`,
      }
    },
  },

  computed: {
    finalPlacement() {
      if (this.placement) {
        return this.placement
      }
      if (this.currentScreenOrientation === 'landscape') {
        return this.landscapePlacement
      } else {
        return this.portraitPlacement
      }
    },
  },
})
</script>

<style scoped lang="scss">
@use '../../utils.scss';

@keyframes pop-in {
  0% {
    transform: scale(0.1);
  }
  80% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
}

.explanation-indicator {
  $lineHeight: 2.6rem;
  position: fixed;
  font-size: 120%;
  z-index: 500;
  display: flex;
  line-height: $lineHeight;
  margin-top: calc($lineHeight / -2);
  pointer-events: none;
  @include utils.text-outline();
  @include utils.filter(drop-shadow(0.2rem 0.2rem 0.1rem black));

  .pointer {
    $dashHeight: 0.2rem;
    width: 2rem;
    min-width: 2rem;
    margin-top: calc(($lineHeight - $dashHeight) / 2);
    height: $dashHeight;
    background: white;
    //border: 1px solid black;
    background-clip: content-box;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      border-left: 1rem solid white;
      border-top: 0.5rem solid transparent;
      border-bottom: 0.5rem solid transparent;
      bottom: calc(-0.5rem + $dashHeight / 2);
      right: -0.3rem;
    }
  }
  .text {
    pointer-events: all;
    white-space: nowrap;
  }

  &.top {
    transform: rotate(-90deg);
    transform-origin: left;
    margin-bottom: calc($lineHeight / -2);

    .text {
      margin-left: 1.5rem;
      transform: rotate(35deg);
      transform-origin: left;
    }
    .pointer {
      margin-left: 0.5rem;

      &::before {
        right: initial;
        left: -0.3rem;
        border-left: 0;
        border-right: 1rem solid white;
      }
    }
  }
  &.top-left {
    flex-direction: row-reverse;
    right: 100%;
    transform: rotate(45deg);
    transform-origin: right;

    .text {
      margin-right: 0.5rem;
      transform: rotate(-45deg);
      transform-origin: right;
    }

    .pointer {
      margin-left: 0.5rem;
    }
  }

  &.bottom {
    transform: rotate(90deg);
    transform-origin: left;
    margin-bottom: calc($lineHeight / -2);

    .text {
      margin-left: 1.5rem;
      transform: rotate(-35deg);
      transform-origin: left;
    }
    .pointer {
      margin-left: 0.5rem;

      &::before {
        right: initial;
        left: -0.3rem;
        border-left: 0;
        border-right: 1rem solid white;
      }
    }
  }
  &.left {
    flex-direction: row-reverse;

    .text {
      margin-right: 1rem;
    }
    .pointer {
      margin-right: 0.5rem;
    }
  }
  &.right {
    .text {
      margin-left: 1rem;
    }
    .pointer {
      margin-left: 0.5rem;

      &::before {
        right: initial;
        left: -0.3rem;
        border-left: 0;
        border-right: 1rem solid white;
      }
    }
  }
}
</style>
