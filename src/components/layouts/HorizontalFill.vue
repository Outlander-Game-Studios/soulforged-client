<template>
  <div class="horizontal-fill wrapper">
    <div class="horizontal-fill main" :class="{ tight: tight }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tight: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.horizontal-fill.main {
  display: flex;
  flex-direction: row;

  > * {
    flex-grow: 1;
  }

  &:not(.tight) > * {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
