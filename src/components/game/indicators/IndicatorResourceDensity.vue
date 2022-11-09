<template>
  <span
    class="indicator-resource-density use-img"
    :class="['density-' + density, { 'high-res': highRes }]"
  >
    <div class="part part-1" />
    <div class="part part-2" />
    <div class="part part-3" />
    <div class="part part-4" />
  </span>
</template>

<script>
export default {
  props: {
    density: {},
    highRes: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../utils.scss";

.indicator-resource-density {
  $border: 0.05em;
  vertical-align: text-bottom;
  width: 1em;
  height: 1em;
  overflow: hidden;

  .part {
    border-bottom: $border solid black;
    flex-grow: 1;
    background: yellow;

    &:last-child {
      border: 0;
    }
  }

  &.density-9000 {
    .part {
      background: skyblue;
    }
  }
  &.density-4 {
    .part {
      background: limegreen;
    }
  }
  &.density-3 {
    .part {
      background: yellow;
      &.part-1 {
        background: #111;
      }
    }
  }
  &.density-2 {
    .part {
      background: darkorange;
      &.part-1 {
        background: #111;
      }
      &.part-2 {
        background: #111;
      }
    }
  }
  &.density-1 {
    .part {
      background: firebrick;
      &.part-1 {
        background: #111;
      }
      &.part-2 {
        background: #111;
      }
      &.part-3 {
        background: #111;
      }
    }
  }

  &:not(.use-img) {
    border: $border solid black;
    box-sizing: border-box;
    background: black;
    border-radius: 0.2em;
    position: relative;
    display: inline-flex;
    flex-direction: column;
  }

  &.use-img {
    display: inline-block;
    background-image: url(ui-asset(
      "/misc/resource-indicators-small.png",
      "../"
    ));
    background-size: 100% 500%;

    &.high-res {
      background-image: url(ui-asset("/misc/resource-indicators.png", "../"));
    }

    &.density-4 {
      background-position: 0 25%;
    }
    &.density-3 {
      background-position: 0 50%;
    }
    &.density-2 {
      background-position: 0 75%;
    }
    &.density-1 {
      background-position: 0 100%;
    }

    .part {
      display: none;
    }
  }
}
</style>
