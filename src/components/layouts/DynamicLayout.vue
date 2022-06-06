<template>
  <div class="dynamic-layout">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.dynamic-layout {
  @media (orientation: landscape) {
    display: flex;
    > * {
      width: 100%;
    }
    > * + * {
      margin-left: 1rem;
    }
  }

  @media (orientation: portrait) {
    > * + * {
      margin-top: 1rem;
    }
  }
}
</style>
