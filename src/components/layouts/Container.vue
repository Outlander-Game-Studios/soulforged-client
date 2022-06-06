<template>
  <div
    class="border-container"
    @click="$emit('click', $event)"
    @mousedown="$emit('mousedown', $event)"
    :class="[
      { top, bottom, left, right, spaced: spaced },
      'border-' + borderType,
      'background-' + backgroundType,
    ]"
    :style="{
      'border-width': borderSize + 'rem',
      'border-radius': borderSize + 'rem',
      ...customStyle,
    }"
  >
    <slot />
  </div>
</template>

<script>
import "./Backgrounds.vue";

export default {
  props: {
    spaced: {
      type: Boolean,
      default: false,
    },
    backgroundType: {
      default: "base",
      validator: PropValidator.oneOf(global.BACKGROUNDS),
    },
    customStyle: {
      default: () => ({}),
    },
    borderType: {
      default: "base",
      validator: PropValidator.oneOf(["none", "base", "alt", "alt2", "alt3"]),
    },
    borderSize: {
      default: 0.75,
    },
    top: {
      default: true,
    },
    bottom: {
      default: true,
    },
    left: {
      default: true,
    },
    right: {
      default: true,
    },
  },
};
</script>

<style scoped lang="scss">
@use "sass:map";
@import "../../utils.scss";

.border-container {
  box-sizing: border-box;
  overflow: auto;
  height: 100%;
  border-style: solid;
  max-height: 100%;

  background-clip: border-box;

  &.spaced {
    padding: 1rem;
  }

  &.border-none {
    border-color: transparent;
  }
  &.border-base {
    @include theme-border();
  }
  &.border-alt {
    @include theme-border-alt();
  }
  &.border-alt2 {
    @include theme-border-alt-2();
  }
  &.border-alt3 {
    @include theme-border-alt-3();
  }

  &:not(.top) {
    border-top-width: 0 !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
  &:not(.bottom) {
    border-bottom-width: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  &:not(.left) {
    border-left-width: 0 !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
  &:not(.right) {
    border-right-width: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
