<template>
  <div class="wrapper" draggable="false">
    <div class="slider" :class="{ disabled: isDisabled }" draggable="false">
      <div
        class="rail"
        ref="rail"
        @mousedown.prevent="draggingBackground($event)"
        @touchstart="draggingBackground($event)"
        draggable="false"
      />
      <div class="handle-container" draggable="false">
        <div
          class="handle"
          :style="handleStyle"
          @mousedown.prevent="startDragging($event)"
          @touchstart="startDragging($event)"
          draggable="false"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import sliderSound from '../../assets/sounds/slider.mp3'

export default {
  props: {
    min: {
      default: 0,
    },
    max: {
      default: 100,
    },
    value: {},
    step: {
      type: Number,
      default: -1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value: {
      handler() {
        this.ensureMinMax()
      },
      immediate: true,
    },
    min: {
      handler() {
        this.ensureMinMax()
      },
      immediate: true,
    },
    max: {
      handler() {
        this.ensureMinMax()
      },
      immediate: true,
    },
  },

  computed: {
    isDisabled() {
      return this.disabled || this.min >= this.max
    },

    leftPosition() {
      return (((this.value || this.min) - this.min) / (this.max - this.min)) * 100
    },

    handleStyle() {
      return {
        left: `${this.leftPosition}%`,
      }
    },
  },

  methods: {
    ensureMinMax() {
      if (!this.value && this.value !== 0) {
        return
      }
      const actualValue = Math.limit(this.value, this.min, this.max)
      if (actualValue !== this.value) {
        this.$emit('update:value', actualValue)
      }
    },
    setValueBaseOnPosition(position) {
      if (position === null) {
        return
      }
      position = position / this.$refs.rail.clientWidth
      position = Math.max(0, Math.min(1, position))
      let value
      if (this.step !== -1) {
        const stepsCount = (this.max - this.min) / this.step
        position = Math.round(position * stepsCount)
        value = (position * (this.max - this.min)) / stepsCount + this.min
      } else {
        value = position * (this.max - this.min) + this.min
      }
      if (this.old === value) {
        return
      }
      SoundService.playSound(sliderSound, {
        speed: 2,
        unique: 'slider',
        throttle: 50,
      })
      this.old = value
      this.$emit('update:value', value)
    },

    getOffsetX(event) {
      if (!this.$refs.rail) {
        return null
      }
      const left = this.$refs.rail.getBoundingClientRect().left
      if (event.clientX) {
        return event.clientX - left
      }
      if (event.targetTouches && event.targetTouches.length === 1) {
        return event.targetTouches[0].clientX - left
      }

      return null
    },

    draggingBackground(event) {
      this.setValueBaseOnPosition(this.getOffsetX(event))
      this.startDragging(event)
    },

    startDragging() {
      const mouseMoveHandler = (moveEvent) => {
        if (moveEvent.buttons === 1 || moveEvent.touches) {
          this.setValueBaseOnPosition(this.getOffsetX(moveEvent))
        } else {
          mouseUpHandler()
        }
      }
      const mouseUpHandler = () => {
        window.removeEventListener('mouseup', mouseUpHandler)
        window.removeEventListener('touchend', mouseUpHandler)
        window.removeEventListener('mousemove', mouseMoveHandler)
        window.removeEventListener('touchmove', mouseMoveHandler)
      }
      window.addEventListener('mouseup', mouseUpHandler)
      window.addEventListener('touchend', mouseUpHandler)
      window.addEventListener('mousemove', mouseMoveHandler)
      window.addEventListener('touchmove', mouseMoveHandler)
    },
  },
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use '../../utils.scss';

.slider {
  $knob-size: 3rem;
  height: $knob-size;
  position: relative;

  &:hover {
    @include utils.filter(brightness(1.3));
    @include utils.filter-fix();
  }

  &::before {
    content: '';
    position: absolute;
    left: calc($knob-size / 2);
    right: calc($knob-size / 2);
    top: calc($knob-size / 3);
    bottom: calc($knob-size / 3);
  }

  &.disabled {
    pointer-events: none;
  }

  .rail {
    $rail-height: calc($knob-size / 2);
    box-sizing: border-box;
    margin: calc($knob-size / 4) calc($knob-size / 2);
    @include utils.fill();
    @include utils.theme-slider-rail($rail-height);

    // workaround for rail cutoff bug
    height: calc(#{$rail-height} + 1px);
    background-size: 100% $rail-height;
    background-repeat: no-repeat;
  }

  .handle-container {
    position: absolute;
    left: calc($knob-size / 2);
    width: calc(100% - #{$knob-size});
  }

  .handle {
    position: absolute;
    box-sizing: border-box;
    margin-left: calc($knob-size / -2);
    width: $knob-size;
    height: $knob-size;
    border-radius: 0.1rem;
    z-index: 2;
    @include utils.theme-slider-knob();
  }

  &.disabled {
    @include utils.disabled();
  }
}
</style>
