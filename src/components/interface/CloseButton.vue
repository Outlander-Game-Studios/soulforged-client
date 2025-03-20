<template>
  <div class="close" :class="{ static: static }" @click="mouseClick($event)" :style="style" />
</template>

<script>
import closeSound from '../../assets/sounds/close.mp3'

export default {
  props: {
    size: {
      default: 4,
    },
    static: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    style() {
      return {
        ...(this.static
          ? {}
          : {
              right: -this.size / 3 + 'rem',
              top: -this.size / 3 + 'rem',
            }),
        maxWidth: this.size + 'rem',
        width: this.size + 'rem',
        height: this.size + 'rem',
      }
    },
  },

  methods: {
    mouseClick($event) {
      this.$emit('click', $event)
      SoundService.playSound(closeSound, { speed: 2 })
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.close {
  cursor: pointer;
  position: absolute;
  border-radius: 0.1rem;
  @include utils.theme-modal-close();
  z-index: 6;

  &.static {
    position: static;
  }

  &:hover {
    @include utils.filter(brightness(1.1));
  }
  &:active {
    @include utils.theme-modal-close-pressed();
  }
}
</style>
