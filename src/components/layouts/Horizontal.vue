<template>
  <div class="horizontal wrapper">
    <div class="horizontal main" :class="{ tight: tight }">
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
.horizontal.main {
  display: flex;
  flex-direction: row;

  &:not(.tight) {
    margin-bottom: -1rem;

    > * {
      margin-right: 1rem;
      margin-bottom: 1rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
