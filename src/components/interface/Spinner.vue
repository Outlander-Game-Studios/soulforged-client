<template>
  <div class="spinner" :style="style" :class="{ centered: centered }"></div>
</template>

<script>
import loaderGif from "../../assets/ui/cartoon/misc/loader.gif";
import loaderPng from "../../assets/ui/cartoon/misc/loader.png";

export default {
  props: {
    centered: {
      type: Boolean,
      default: false,
    },
    size: {
      default: 5,
    },
    color: {
      default: "black",
    },
  },

  computed: {
    style() {
      const margins = this.centered
        ? {
            marginLeft: -this.size / 2 + "rem",
            marginTop: -this.size / 2 + "rem",
          }
        : {};
      const imageUrl = ControlsService.isStoryshots() ? loaderPng : loaderGif;
      return {
        ...margins,
        "background-image": `url(${imageUrl})`,
        width: this.size + "rem",
        height: this.size + "rem",
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

$speed: 2s;
$size: 22%;

.spinner {
  display: inline-block;
  position: relative;
  background-size: 100% 100%;

  &.centered {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .element {
    position: absolute;
    width: 100%;
    height: 100%;

    @for $i from 1 through 12 {
      &:nth-child(#{$i}) {
        transform: rotate(#{$i * 30}deg);
        .dot {
          animation-delay: -#{calc((12 - $i) * $speed / 12)};
        }
      }
    }

    .dot {
      width: $size;
      height: $size;
      left: 50% - calc($size / 2);
      position: absolute;
      border-radius: 50%;
      animation: spinner $speed linear infinite;
      border: 1px solid black;
    }
  }
}
@keyframes spinner {
  0% {
    transform: scale(0);
  }
  5% {
    transform: scale(1);
  }
  50%,
  100% {
    transform: scale(0);
  }
}
</style>
