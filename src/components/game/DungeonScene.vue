<template>
  <div class="dungeon-scene-wrapper">
    <div v-if="dungeonAssets" class="dungeon-scene" :class="sceneClass">
      <div class="ceiling" :style="styles.ceiling">
        <div class="fill-top" :style="styles.fillTop"></div>
        <div class="wall-left" :style="styles.wallLeft"></div>
        <div class="wall-right" :style="styles.wallRight"></div>
        <div class="objects">
          <div class="avatars">
            <!--            <Avatar-->
            <!--              :creature="myCreature"-->
            <!--              :headOnly="false"-->
            <!--              size="large"-->
            <!--              noFrame-->
            <!--            />-->
          </div>
          <div
            class="doodad"
            v-for="(doodad, idx) in processedDoodads"
            :key="idx"
            :style="doodad.style"
          ></div>
        </div>
      </div>
      <div class="backwall" :style="styles.backwall"></div>
      <div class="floor" :style="styles.floor">
        <div class="fill-bottom" :style="styles.fillBottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  subscriptions() {
    return {
      tabOpened: ControlsService.getCurrentOpenTabStream().map((tab) => !!tab),
      myCreature: GameService.getMyCreatureStream(),
      dungeonAssets: GameService.getLocationStream()
        .pluck("dungeon")
        .pluck("assets"),
    };
  },

  computed: {
    sceneClass() {
      if (this.tabOpened) {
        return "panel-opened";
      }
      return "";
    },

    processedDoodads() {
      return this.dungeonAssets.doodads
        ?.sort((a, b) => a.layer - b.layer)
        .map((doodad) => ({
          ...doodad,
          style: {
            backgroundImage: `url(${doodad.img})`,
            backgroundSize: `${0.2 * doodad.size}% auto`,
            left: doodad.placement.first() + "%",
            top: doodad.placement.last() + "%",
            zIndex: doodad.layer,
          },
        }));
    },

    styles() {
      return [
        "backwall",
        "ceiling",
        "floor",
        "fillTop",
        "fillBottom",
        "wallLeft",
        "wallRight",
      ].toObject(
        (key) => key,
        (key) => ({
          backgroundImage: `url(${this.dungeonAssets[key]})`,
        })
      );
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

$size-base: min(var(--app-width), var(--app-height) * 3);
$ceiling-height: calc(#{$size-base} * 0.065);
$backwall-width: calc(#{$size-base} * 0.35);
$backwall-ratio: calc(2048 / 958);
$backwall-height: calc(#{$backwall-width} * 1 / #{$backwall-ratio});
$floor-height: calc(#{$size-base} * 0.1);

.dungeon-scene-wrapper {
  @include fill();
  background: black;
  display: flex;
  justify-content: center;
}

.dungeon-scene {
  overflow: hidden;
  position: relative;
  width: $size-base;
  z-index: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.panel-opened {
    @media (orientation: landscape) {
      left: -20rem;

      &::after {
        content: "";
        right: -0.5rem;
        height: 200%;
        width: 50%;
        position: absolute;
        z-index: 1;
        box-shadow: -2.5rem 0 2rem inset black;
      }
    }
    @media (orientation: portrait) {
      top: calc(-0.2 * var(--app-height));
    }
  }
}

.ceiling {
  height: $ceiling-height;
  background-size: auto 100%;
  background-position: center center;
  background-repeat: repeat-x;
  position: relative;
  z-index: 1;
  margin-bottom: calc(#{$size-base} * -0.02);

  .fill-top {
    position: absolute;
    height: calc(var(--app-height) / 2);
    width: 100%;
    bottom: $ceiling-height;
    background-size: auto 100%;
    background-position: center center;
    margin-bottom: calc(#{$size-base} * -0.004);
  }

  .wall-left,
  .wall-right {
    position: absolute;
    top: 0;
    height: calc(#{$ceiling-height} + #{$backwall-height} + #{$floor-height});
    width: calc(#{$size-base} / 3);
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .wall-left {
    left: calc(#{$size-base} * -0.065);
  }
  .wall-right {
    right: calc(#{$size-base} * -0.065);
  }

  .objects {
    height: calc(#{$ceiling-height} + #{$backwall-height} + #{$floor-height});
    width: 100%;
    position: absolute;
  }
  .avatars {
    position: absolute;
    top: calc(#{$size-base} * 0.095);
    z-index: 200;
    width: 40%;
    left: 40%;
  }
  .doodad {
    position: absolute;
    background-repeat: no-repeat;
    background-position: center center;
    width: $size-base;
    height: $size-base;
    margin-left: calc(#{$size-base} / -2);
    margin-top: calc(#{$size-base} / -2);
  }
}
.backwall {
  height: $backwall-height;
  background-size: $backwall-width auto;
  background-position: center center;
  background-repeat: repeat-x;
}
.floor {
  height: $floor-height;
  background-size: auto 100%;
  background-position: center center;
  background-repeat: repeat-x;
  position: relative;
  z-index: -1;
  margin-top: calc(#{$size-base} * -0.01);

  .fill-bottom {
    position: absolute;
    height: calc(var(--app-height) / 2);
    width: 100%;
    top: $floor-height;
    background-size: auto 100%;
    background-position: center center;
    margin-top: calc(#{$size-base} * -0.004);
    z-index: 3;
  }
}
</style>
