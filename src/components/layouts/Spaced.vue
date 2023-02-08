<template>
  <div class="spaced wrapper">
    <div class="spaced main" :class="{ small: small }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
    },
  },
};
</script>

<style scoped lang="scss">
.spaced.wrapper {
  overflow: auto;
  flex-grow: 1;
}
.spaced.main {
  margin: 1rem;

  &.small {
    margin: 0.5rem;
  }
}
</style>
