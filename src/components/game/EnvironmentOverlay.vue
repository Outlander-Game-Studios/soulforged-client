<template>
  <div class="environment-overlay" v-if="levels">
    <div
      class="darkness"
      v-if="levels.darkness"
      :class="'level-' + levels.darkness"
    />
    <div
      class="sunshine"
      v-if="levels.sunshine"
      :class="'level-' + levels.sunshine"
    >
      <div class="overlay"></div>
      <div class="lens-center">
        <div class="shine-1"></div>
        <div class="shine-2"></div>
        <div class="circle-3"></div>
        <div class="circle-1"></div>
        <div class="circle-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  subscriptions() {
    return {
      environment: GameService.getRootEntityStream().pluck("environment"),
    };
  },

  computed: {
    levels() {
      return this.environment?.toObject(
        (e) => e.name.replace(/\s\(.*\)/, "").toLowerCase(),
        (e) => (e.level === undefined ? true : e.level)
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.environment-overlay {
  position: absolute;
  pointer-events: none;
}
.darkness {
  @include fill();
  position: fixed;
  z-index: 1;
  width: 100%;
  height: 100%;

  @for $i from 0 through 10 {
    &.level-#{$i} {
      background: rgba(0, 0, 0, calc($i / 14));
    }
  }
}
.sunshine {
  .overlay {
    @include fill();
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  @for $i from 0 through 10 {
    &.level-#{$i} {
      .overlay {
        background: rgba(218, 165, 32, calc($i / 30));
      }
      .lens-center {
        opacity: calc($i / 10);
      }
    }
  }

  .lens-center {
    @include fill();
    z-index: 1;
    position: fixed;
    $positionRatio: 1.3;

    @mixin lens($size, $placement) {
      position: absolute;
      border-radius: 100%;
      width: $size;
      height: $size;
      margin-left: calc($size / -2);
      margin-top: calc($size / -2);
      left: 50vw + $placement * 1vw;
      top: 50vh + $placement * $positionRatio * 1vh;
    }

    .shine-1 {
      @include lens(80vmin, -30);
      background: radial-gradient(
        closest-side circle at center,
        #fff9da 0%,
        transparent 100%
      );
    }

    .shine-2 {
      @include lens(40vmin, -30);
      @include filter(blur(0.4rem));
      background: radial-gradient(
        closest-side circle at center,
        rgb(225, 220, 150) 0%,
        rgba(255, 220, 150, 1) 15%,
        rgba(255, 220, 150, 0.6) 30%,
        rgba(255, 220, 150, 0.3) 55%,
        rgba(255, 220, 150, 0.1) 75%,
        transparent 99%
      );
    }

    .circle-1 {
      @include lens(28vmin, 30);
      @include filter(blur(0.5rem));
      background: radial-gradient(
        closest-side circle at center,
        transparent 50%,
        rgba(255, 249, 218, 0.7) 90%,
        transparent 100%
      );
    }

    .circle-2 {
      @include lens(16vmin, 20);
      @include filter(blur(0.2rem));
      background: rgba(255, 249, 218, 0.4);
    }

    .circle-3 {
      @include lens(10vmin, -18);
      background: radial-gradient(
        closest-side circle at center,
        rgba(255, 249, 218, 0.8) 0%,
        transparent 75%
      );
    }
  }
}
</style>
