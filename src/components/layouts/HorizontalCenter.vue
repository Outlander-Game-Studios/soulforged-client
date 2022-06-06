<template>
  <div class="horizontal-center wrapper">
    <div class="horizontal-center main" :class="{ tight: tight, wrap: wrap }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tight: {
      type: Boolean,
    },
    wrap: {
      type: Boolean,
    },
  },
};
</script>

<style scoped lang="scss">
.horizontal-center.main {
  display: flex;
  flex-direction: row;
  justify-content: center;

  &.wrap {
    flex-wrap: wrap;
  }

  &:not(.tight) {
    > * {
      margin-right: 1rem;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
