<template>
  <div class="hit-text" :class="cssClass">{{ text }}</div>
</template>

<script>
export default {
  props: {
    hitLevel: {},
  },

  computed: {
    cssClass() {
      switch (true) {
        case this.hitLevel >= 1:
          return "great";
        case this.hitLevel >= 0.5:
          return "good";
        case this.hitLevel > 0:
          return "poor";
        default:
          return "default";
      }
    },
    text() {
      switch (true) {
        case this.hitLevel >= 1:
          return "Perfect hit!";
        case this.hitLevel >= 0.5:
          return "Solid hit!";
        case this.hitLevel > 0:
          return "Glancing hit";
        default:
          return "Miss";
      }
    },
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
