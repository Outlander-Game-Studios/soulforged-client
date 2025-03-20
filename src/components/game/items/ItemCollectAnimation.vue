<template>
  <div class="item-collect-animation" @click="$emit('click')" @mousedown="mouseDown()">
    <TopZIndex v-if="acquireAnimations.length">
      <img
        v-for="acquireAnimation in acquireAnimations"
        :key="acquireAnimation.animId"
        class="acquire-animation"
        :style="acquireAnimation.style"
        :src="icon"
      />
    </TopZIndex>
    <div v-if="successes" class="gain-indicator" :key="'success' + successes">
      <img class="indicator-icon" ref="producedItems.icon" :src="icon" />
      <div class="indicator-text">{{ gainPrefix }}{{ successes }}</div>
    </div>
    <div v-if="failures" class="fail-indicator" :key="'failure' + failures">
      <div class="indicator-text">{{ failPrefix }}{{ failures }}</div>
    </div>
    <ItemIcon
      ref="icon"
      :icon="icon"
      :size="size"
      :amount="amount"
      :quality="quality"
      :condition="condition"
      :isEquipped="isEquipped"
    >
      <template #amount><slot name="amount"></slot></template>
    </ItemIcon>
  </div>
</template>

<script>
import iconClickSound from '../../../assets/sounds/icon-click.mp3'

export default {
  props: {
    amount: {},
    icon: {},
    quality: {},
    condition: {},
    isEquipped: {
      type: Boolean,
    },
    size: {
      default: 5,
    },
    gainPrefix: {
      default: '+',
    },
  },

  data: () => ({
    failPrefix: '',
    failures: 0,
    successes: 0,
    producedItems: null,
    acquireAnimations: [],
  }),

  mounted() {
    this.animationId = 1
  },

  beforeUnmount() {
    clearTimeout(this.cleanupTimeout)
    this.componentDestroyed = true
  },

  methods: {
    mouseDown() {
      if (!!this.$attrs.onClick) {
        SoundService.playSound(iconClickSound)
      }
    },

    apiAddCollected({ results, failPrefix }, selector) {
      this.failPrefix = failPrefix
      const stream = new Rx.ReplaySubject()
      clearTimeout(this.cleanupTimeout)
      const interval = ControlsService.setAnimationInterval(() => {
        if (this.componentDestroyed) {
          stream.complete()
          return clearInterval(interval)
        }
        if (results.length === 0) {
          clearInterval(interval)
          stream.complete()
          this.cleanupTimeout = ControlsService.setAnimationTimeout(() => {
            this.producedItems = null
            this.acquireAnimations = []
            this.successes = 0
            this.failures = 0
          }, 3000)
          return
        }
        clearTimeout(this.cleanupTimeout)
        const result = results.shift()
        if (result.gain > 0) {
          this.itemAcquired(0, selector, result)
        }
        for (let i = 0; i < (result.gain || 0); i++) {
          this.successes += 1
        }
        for (let i = 0; i < (result.loss || 0); i++) {
          this.failures += 1
        }
        stream.next(results.length)
      }, 80)
      return stream
    },

    itemAcquired(delay = 0, selector = '.tab-icon.inventory', { targetSize = 0.3 } = {}) {
      ControlsService.setAnimationTimeout(() => {
        if (this.componentDestroyed) {
          return
        }
        const source = this.$refs.icon && this.$refs.icon.$el.querySelector('.icon')
        const target = document.querySelector(selector)
        if (!source || !target) {
          return
        }
        const sourceBoundingRect = source.getBoundingClientRect()
        const targetBoundingRect = target.getBoundingClientRect()
        const animation = {
          animId: this.animationId++,
          step: 0,
          style: {
            top: sourceBoundingRect.top + 'px',
            left: sourceBoundingRect.left + 'px',
            zIndex: this.animationId + 9000,
            width: sourceBoundingRect.width + 'px',
            height: sourceBoundingRect.height + 'px',
          },
        }
        let increase = 1
        const interval = ControlsService.setAnimationInterval(() => {
          if (this.componentDestroyed) {
            return clearInterval(interval)
          }
          animation.step += increase
          increase *= 1.01
          animation.step = Math.min(animation.step, 100)
          const targetFraction = animation.step / 100
          const sourceFraction = 1 - targetFraction
          const size = sourceFraction + targetSize * targetFraction
          animation.style = {
            ...animation.style,
            top:
              Math.round(
                sourceBoundingRect.top * sourceFraction +
                  (targetBoundingRect.top + 8) * targetFraction,
              ) + 'px',
            left:
              Math.round(
                sourceBoundingRect.left * sourceFraction +
                  (targetBoundingRect.left + 8) * targetFraction,
              ) + 'px',
            width: Math.round(sourceBoundingRect.width * size) + 'px',
            height: Math.round(sourceBoundingRect.height * size) + 'px',
          }
          if (animation.step >= 100) {
            clearInterval(interval)
            this.acquireAnimations = this.acquireAnimations.filter((a) => a !== animation)
          }
        }, 10)
        this.acquireAnimations = [...this.acquireAnimations, animation]
      }, delay * 20)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../../utils.scss';

@keyframes shift-up {
  0% {
    margin-top: 0;
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    margin-top: -3rem;
  }
}
@keyframes shift-down {
  0% {
    margin-bottom: 0;
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    margin-bottom: -3rem;
  }
}

.item-collect-animation {
  position: relative;
}

.fail-indicator,
.gain-indicator {
  background: rgba(0, 0, 0, 0.7);
  height: 2.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  border: 1px solid black;

  font-size: 1.4rem;

  position: absolute;
  z-index: 12;
  display: flex;

  animation-timing-function: ease-in;
  animation-duration: 2s;
  animation-delay: 1s;
  animation-fill-mode: forwards;

  .indicator-icon {
    width: 2.2rem;
    height: 2.2rem;
  }

  .indicator-text {
    white-space: nowrap;
    padding: 0 0.5rem;
    line-height: 2.3rem;
  }
}

.gain-indicator {
  animation-name: shift-up;
  top: -2.8rem;
  right: 0.2rem;

  .indicator-text {
    @include utils.text-outline(black, limegreen);
  }
}

.fail-indicator {
  animation-name: shift-down;
  bottom: -2.8rem;
  right: 0.2rem;

  .indicator-text {
    @include utils.text-outline(#000000, #ff4c4c);
  }
}

.acquire-animation {
  will-change: transform;
  pointer-events: none;
  position: fixed;
}
</style>
