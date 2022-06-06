<template>
  <div class="description-container" :class="{ pre: pre }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
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
}
</style>
