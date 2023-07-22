<template>
  <div class="hit-text" :class="type">{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: {},
    type: {},
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.hit-text {
  white-space: nowrap;
  &.default {
    @include text-outline();
  }
  &.great {
    @include text-outline(black, limegreen);
  }
  &.good {
    @include text-outline(black, yellow);
  }
  &.poor {
    @include text-outline(black, darkorange);
  }
}
</style>
