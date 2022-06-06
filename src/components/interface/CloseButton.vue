<template>
  <div
    class="close"
    :class="{ static: static }"
    @click="mouseClick($event)"
    :style="style"
  />
</template>

<script>
import closeSound from "../../assets/sounds/close.ogg";

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
              right: -this.size / 3 + "rem",
              top: -this.size / 3 + "rem",
            }),
        maxWidth: this.size + "rem",
        width: this.size + "rem",
        height: this.size + "rem",
      };
    },
  },

  methods: {
    mouseClick($event) {
      this.$emit("click", $event);
      SoundService.playSound(closeSound, { speed: 2 });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.close {
  cursor: pointer;
  position: absolute;
  border-radius: 0.1rem;
  @include theme-modal-close();
  z-index: 6;

  &.static {
    position: static;
  }

  &:hover {
    @include filter(brightness(1.1));
  }
  &:active {
    @include theme-modal-close-pressed();
  }
}
</style>
