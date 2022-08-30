<template>
  <div
    class="description-container"
    :class="{ pre: pre, prominent: prominent }"
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
    pre: {
      type: Boolean,
    },
  },
};
</script>

<style scoped lang="scss">
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
}
</style>
