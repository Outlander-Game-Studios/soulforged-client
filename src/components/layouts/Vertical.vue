<template>
  <div class="vertical-wrapper" :class="{ flex: flex }">
    <div class="vertical main" :class="{ 'with-spacing': !tight }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flex: {
      type: Boolean,
      default: false,
    },
    tight: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.vertical-wrapper.flex {
  display: flex;

  .vertical.main {
    flex-grow: 1;
  }
}

.vertical.main {
  display: flex;
  flex-direction: column;

  &.with-spacing > * {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
