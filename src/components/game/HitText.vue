<template>
  <div class="hit-text" :class="type">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: {},
    type: {},
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.hit-text {
  white-space: nowrap;
  &.default {
    @include utils.text-outline();
  }
  &.great {
    @include utils.text-outline(black, limegreen);
  }
  &.good {
    @include utils.text-outline(black, yellow);
  }
  &.poor {
    @include utils.text-outline(black, darkorange);
  }
}
</style>
