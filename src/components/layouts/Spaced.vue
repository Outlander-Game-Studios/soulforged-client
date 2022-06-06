<template>
  <div class="spaced wrapper">
    <div class="spaced main">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spaced.wrapper {
  overflow: auto;
  flex-grow: 1;
}
.spaced.main {
  margin: 1rem;
}
</style>
