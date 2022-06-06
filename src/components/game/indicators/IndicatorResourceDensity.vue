<template>
  <span class="indicator-resource-density" :class="'density-' + density">
    <div class="part part-1" />
    <div class="part part-2" />
    <div class="part part-3" />
  </span>
</template>

<script>
export default {
  props: {
    density: {},
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.indicator-resource-density {
  $border: 0.05px;
  vertical-align: text-bottom;
  width: 1em;
  height: 1em;
  border: $border solid black;
  box-sizing: border-box;
  background: black;
  border-radius: 0.2em;
  overflow: hidden;
  position: relative;
  display: inline-flex;
  flex-direction: column;

  .part {
    border-bottom: $border solid black;
    flex-grow: 1;
    background: yellow;

    &:last-child {
      border: 0px;
    }
  }

  &.density-4 {
    .part {
      background: skyblue;
    }
  }
  &.density-3 {
    .part {
      background: lawngreen;
    }
  }
  &.density-2 {
    .part {
      background: orange;
      &.part-1 {
        background: #111;
      }
    }
  }
  &.density-1 {
    .part {
      background: red;
      &.part-1 {
        background: #111;
      }
      &.part-2 {
        background: #111;
      }
    }
  }
}
</style>
