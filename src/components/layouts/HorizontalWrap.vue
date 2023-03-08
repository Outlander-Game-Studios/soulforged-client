<template>
  <div class="horizontal-wrap wrapper">
    <div class="horizontal-wrap main" :class="{ tight: tight, fill: fill }">
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
    fill: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.horizontal-wrap.main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &.fill {
    > * {
      display: flex;
      flex-grow: 1;
    }
  }

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
