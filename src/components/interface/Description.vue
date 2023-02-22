<template>
  <div
    class="description-container"
    :class="{
      pre: pre,
      prominent: prominent,
      warning: warning,
      inline: inline,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    prominent: {
      type: Boolean,
    },
    warning: {
      type: Boolean,
    },
    pre: {
      type: Boolean,
    },
    inline: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
@import "../../utils.scss";

.description-container {
  color: #555;
  font-style: italic;
  font-size: 80%;

  &.pre {
    white-space: pre-wrap;
  }

  &.prominent {
    font-size: 100%;
    color: #222;
  }
  &.warning {
    font-size: 100%;
    font-style: normal;
    text-align: center;
    @include text-outline(#492000, #ffbb4f);

    &.inline {
      display: inline-block;
    }
  }

  &.inline {
    display: inline-block;
  }

  em {
    font-weight: bold;
    color: #222;
  }
}
</style>
