<template>
  <Container
    :borderSize="borderSize"
    :borderType="noFrame ? 'none' : 'base'"
    :backgroundType="noFrame ? 'none' : 'base'"
    class="avatar-wrapper"
    :class="[
      {
        'head-only': headOnly,
        frame: !noFrame,
        interactive: hasClick,
        flipped: flipped,
      },
      size,
    ]"
    @click="$emit('click')"
  >
    <div v-if="text" class="avatar-text">{{ text }}</div>
    <div
      class="player-avatar"
      :class="[{ 'head-only': headOnly }, animations, size]"
    >
      <div v-show="loading" class="loading">
        <Spinner centered :size="spinnerSize" color="#964500" />
      </div>
      <div v-show="!loading" class="avatar-body-wrapper">
        <div class="body">
          <div class="arm-anchor left">
            <div
              class="forearm"
              :style="avatarAssetsStyles(`body_parts_v2`, [0, 0], [31, 42])"
            />
            <div
              v-if="!headOnly"
              class="hand"
              :style="avatarAssetsStyles(`body_parts_v2`, [0, 66], [27, 25])"
            />
            <div
              v-if="!headOnly"
              class="fingers"
              :style="avatarAssetsStyles(`body_parts_v2`, [0, 42], [26, 24])"
            />
          </div>
          <div class="leg-anchor left" v-if="!headOnly">
            <div
              class="hip"
              :style="avatarAssetsStyles(`body_parts_v2`, [0, 91], [31, 32])"
            />
            <div
              class="foot"
              :style="avatarAssetsStyles(`body_parts_v2`, [0, 123], [32, 27])"
            />
          </div>
          <div
            class="torso"
            :style="avatarAssetsStyles(`body_parts_v2`, [64, 122], [59, 67])"
          />
          <div class="head-anchor">
            <div
              class="face"
              :style="avatarAssetsStyles(`body_parts_v2`, [64, 0], [115, 122])"
            />
            <div
              class="head-wear"
              :style="avatarAssetsStyles(`equipment/head`, [0, 0], [512, 512])"
            />
            <div
              class="eyes"
              :style="
                avatarAssetsStyles(
                  `eye/all_brows`,
                  [0, 70 * eyesType],
                  [110, 70]
                )
              "
            />
            <div
              class="eyes"
              :style="
                avatarAssetsStyles(
                  `eye/all_eyes`,
                  [0, 70 * eyesType],
                  [110, 70]
                )
              "
            />
            <div class="hair" :style="avatarAssetsStyles(`hair`)" />
            <div
              class="mouth"
              :style="
                avatarAssetsStyles(
                  `mouth/all`,
                  [0, 250 * mouthState],
                  [250, 250]
                )
              "
            />
            <div class="ear" :style="avatarAssetsStyles(`ear`)" />
          </div>
          <div class="leg-anchor right" v-if="!headOnly">
            <div
              class="hip"
              :style="avatarAssetsStyles(`body_parts_v2`, [32, 91], [31, 32])"
            />
            <div
              class="foot"
              :style="avatarAssetsStyles(`body_parts_v2`, [32, 123], [32, 27])"
            />
          </div>
          <div class="arm-anchor right">
            <div
              class="forearm"
              :style="avatarAssetsStyles(`body_parts_v2`, [31, 0], [31, 42])"
            />
            <div
              v-if="!headOnly"
              class="hand"
              :style="avatarAssetsStyles(`body_parts_v2`, [31, 42], [30, 27])"
            />
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import { Rx } from "@/rx.js";

const EYES = {
  DEAD: 3,
  SLEEPING: 4,
  EXTREME_PAIN: 6,
  PAIN: 5,
  BLINKING: 5,
  TIRED: 2,
  BASE: 0,
  WIDE: 7,
};
const MOUTHS = {
  DEAD: 0,
  SNORING: 1,
  SNORING_TWO: 2,
  EXTREME_PAIN: 3,
  PAIN: 4,
  HAPPY: 5,
  SLIGHTLY_SAD: 6,
  SAD: 7,
  VERY_SAD: 8,
  GLOOMY: 9,
  BASE: 10,
  TONGUE_OUT: 11,
};

const imageSizes = {
  "equipment/head": [512, 512],
  body_parts_v2: [185, 195],
  "eye/all_brows": [110, 560],
  "eye/all_eyes": [110, 560],
  "mouth/all": [250, 3000],
};

export default {
  props: {
    text: {},
    chatHead: {},
    hairColor: false,
    skinColor: false,
    noSleep: {
      type: Boolean,
      default: false,
    },
    flipped: {
      type: Boolean,
      default: false,
    },
    headOnly: {
      type: Boolean,
      default: false,
    },
    noFrame: {
      type: Boolean,
      default: false,
    },
    size: {
      default: "normal",
    },
    creature: null,
    emo: {},
    avatarAssets: {
      default: null,
    },
    variant: {
      default: ENTITY_VARIANTS.BASE,
    },
  },

  data: () => ({
    dead: false,
    sleeping: false,
    snoring: null,
    tired: false,
    blinking: false,
    happy: false,
    slightlySad: false,
    sad: false,
    verySad: false,
    gloomy: false,
    feelingPain: 0,
    loading: true,
  }),

  subscriptions() {
    return {
      chatHeadAssets: this.$stream("chatHead")
        .filter((whoId) => !!whoId)
        .switchMap((whoId) =>
          GameService.getEntityStream(whoId, ENTITY_VARIANTS.CHAT_HEAD)
        )
        .filter((creature) => !!creature)
        .map((creature) => creature.avatar)
        .switchMap((avatarId) =>
          GameService.getEntityStream(avatarId, ENTITY_VARIANTS.CHAT_HEAD)
        )
        .filter((avatar) => !!avatar)
        .map((avatar) => avatar.avatarAssets),
      avatar: this.$stream("creature").switchMap((creature) =>
        creature
          ? GameService.getEntityStream(creature.avatar, this.variant)
          : Rx.Observable.of(null)
      ),
    };
  },

  computed: {
    hasClick() {
      return !!this.$listeners.click;
    },

    borderSize() {
      switch (this.size) {
        case "tiny":
          return 0.3;
        default:
          return 0.6;
      }
    },

    spinnerSize() {
      const ratio = 0.5;
      switch (this.size) {
        case "huge":
          return 16 * ratio;
        case "large":
          return 12 * ratio;
        case "normal":
          return 9 * ratio;
        case "small":
          return 6 * ratio;
        case "tiny":
          return 4 * ratio;
        case "relative":
          return 4 * ratio;
      }
    },

    eyesType() {
      switch (this.emo) {
        case ":)":
          return EYES.BASE;
        case ":D":
          return EYES.BASE;
        case ":(":
          return EYES.BASE;
        case ":<":
          return EYES.TIRED;
        case ":/":
          return EYES.BASE;
        case ":O":
          return EYES.WIDE;
        case ":P":
          return EYES.BASE;
        default:
      }

      if (this.dead) {
        return EYES.DEAD;
      }

      if (this.sleeping) {
        return EYES.SLEEPING;
      }

      if (this.feelingPain >= 3) {
        return EYES.EXTREME_PAIN;
      }
      if (this.feelingPain >= 1) {
        return EYES.PAIN;
      }

      if (this.blinking) {
        return EYES.BLINKING;
      }
      if (this.tired) {
        return EYES.TIRED;
      }
      return EYES.BASE;
    },

    mouthState() {
      switch (this.emo) {
        case ":)":
          return MOUTHS.BASE;
        case ":D":
          return MOUTHS.HAPPY;
        case ":(":
          return MOUTHS.GLOOMY;
        case ":<":
          return MOUTHS.EXTREME_PAIN;
        case ":/":
          return MOUTHS.PAIN;
        case ":O":
          return MOUTHS.SNORING_TWO;
        case ":P":
          return MOUTHS.TONGUE_OUT;
        default:
      }

      if (this.dead) {
        return MOUTHS.DEAD;
      }

      if (this.sleeping) {
        if (this.snoring === 1) {
          return MOUTHS.SNORING;
        }
        if (this.snoring === 0) {
          return MOUTHS.SNORING_TWO;
        }
      }

      if (this.feelingPain >= 3) {
        return MOUTHS.EXTREME_PAIN;
      }
      if (this.feelingPain >= 1) {
        return MOUTHS.PAIN;
      }

      if (this.happy) return MOUTHS.HAPPY;
      if (this.slightlySad) return MOUTHS.SLIGHTLY_SAD;
      if (this.sad) return MOUTHS.SAD;
      if (this.verySad) return MOUTHS.VERY_SAD;
      if (this.gloomy) return MOUTHS.GLOOMY;
      return MOUTHS.BASE;
    },

    animations() {
      (this.animationsTimeouts || []).forEach((ai) => clearInterval(ai));
      this.animationsTimeouts = [];

      if (this.creature) {
        if (this.creature.dead) {
          this.dead = true;
          return;
        }
        const smiling = {
          Cheerful: true,
          Overjoyed: true,
          Ecstatic: true,
        };

        this.happy = this.hasBuff((b) => smiling[b.name]);
        this.slightlySad = this.hasBuff("Slightly Sad");
        this.sad = this.hasBuff("Sad");
        this.verySad = this.hasBuff("Very Sad");
        this.gloomy = this.hasBuff("Gloomy");

        this.tired = this.verySad || this.gloomy;

        this.sleeping = this.creature.inactive && !this.noSleep;
        if (this.sleeping) {
          this.snoring = 0;
          this.repeatingAnimation(
            () => (this.snoring = 1),
            () => (this.snoring = 0),
            () => 1000 + Math.random() * 300,
            () => 1000 + Math.random() * 300
          );
        }

        const painDegree =
          (this.hasBuff("Minor pain") && 1) ||
          (this.hasBuff("Pain") && 2) ||
          (this.hasBuff("Major pain") && 3) ||
          (this.hasBuff("Extreme pain") && 4);

        this.feelingPain = 0;
        this.repeatingAnimation(
          () => (this.feelingPain = painDegree),
          () => (this.feelingPain = 0),
          () => 12000 / painDegree + Math.random() * 2000,
          () => 4000 / (5 - painDegree) + Math.random() * 500
        );

        this.blinking = false;
        this.repeatingAnimation(
          () => (this.blinking = true),
          () => (this.blinking = false),
          () => 3000 + Math.random() * 1000,
          () => 300 + Math.random() * 200
        );
      }

      return "idle";
    },
  },

  methods: {
    registerImageToLoad(imageUrl) {
      const STATE = {
        LOADING: 1,
        LOADED: 2,
      };

      this.images = this.images || {};
      if (this.images[imageUrl] || !imageUrl) {
        return;
      }

      const preloaderImg = document.createElement("img");
      preloaderImg.src = imageUrl;

      const onLoaded = () => {
        this.images[imageUrl] = STATE.LOADED;
        preloaderImg.remove();

        const remainingCount = Object.values(this.images).filter(
          (state) => state !== STATE.LOADED
        ).length;
        if (remainingCount === 0) {
          this.loading = false;
        }
      };

      if (!preloaderImg.complete) {
        this.images[imageUrl] = STATE.LOADING;
        this.loading = true;

        preloaderImg.addEventListener("load", onLoaded);
      } else {
        onLoaded();
      }
    },

    avatarAssetsStyles(asset, [offsetX, offsetY] = [], [sizeX, sizeY] = []) {
      const avatarAssets = this.chatHead
        ? this.chatHeadAssets
        : this.avatar
        ? this.avatar.avatarAssets
        : this.avatarAssets;

      if (!avatarAssets || !avatarAssets[asset]) {
        return;
      }

      const style = {
        "background-image": "url(" + avatarAssets[asset] + ")",
      };
      this.registerImageToLoad(avatarAssets[asset]);
      if (offsetX !== undefined) {
        if (!imageSizes[asset]) {
          throw new Error("No size specified: " + asset);
        }
        const [imageSizeX, imageSizeY] = imageSizes[asset];
        style["background-position-x"] = `${
          (100 * offsetX) / (imageSizeX - sizeX)
        }%`;
        style["background-position-y"] = `${
          (100 * offsetY) / (imageSizeY - sizeY)
        }%`;
        style["background-size"] = `${(imageSizeX / sizeX) * 100}% ${
          (imageSizeY / sizeY) * 100
        }%`;
      } else {
        style["background-size"] = "100%";
      }
      return style;
    },

    repeatingAnimation(
      applyCallback,
      unapply,
      delayGenerator,
      durationGenerator
    ) {
      const timeout = ControlsService.setAnimationTimeout(() => {
        applyCallback();
        const idx = this.animationsTimeouts.indexOf(timeout);
        if (idx !== -1) {
          this.animationsTimeouts.splice(idx, 1);
        }
        this.repeatingAnimation(
          unapply,
          applyCallback,
          durationGenerator,
          delayGenerator
        );
      }, delayGenerator());

      this.animationsTimeouts.push(timeout);
    },

    isAction(name) {
      return this.creature?.currentAction?.actionId === name;
    },

    hasBuff(nameOrCallback) {
      let filter = nameOrCallback;
      if (typeof nameOrCallback !== "function") {
        filter = (b) => b.name.toLowerCase() === nameOrCallback.toLowerCase();
      }
      return this.creature?.effects?.some(filter);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

$avatar-bg-color: beige;

@mixin size($w, $h, $avatar-size-units) {
  height: calc(#{$h} * #{$avatar-size-units});
  width: calc(#{$w} * #{$avatar-size-units});
  min-width: calc(#{$w} * #{$avatar-size-units});
}
@mixin position($l, $t, $avatar-size-units) {
  position: absolute;
  left: calc(#{$l} * #{$avatar-size-units});
  top: calc(#{$t} * #{$avatar-size-units});
}

@mixin bodyPart() {
  background: no-repeat center center;
  position: absolute;
}

@mixin player-avatar($avatar-size) {
  $avatar-size-units: $avatar-size / 160;
  position: relative;

  @include size(200, 300, $avatar-size-units);

  &.head-only {
    min-height: calc(160 * #{$avatar-size-units});
    height: calc(160 * #{$avatar-size-units});
    min-width: calc(160 * #{$avatar-size-units});
    width: calc(160 * #{$avatar-size-units});

    .body {
      left: calc(135 * #{$avatar-size-units});
      top: calc(285 * #{$avatar-size-units});
    }
  }

  .body {
    @include position(80, 180, #{$avatar-size-units});

    .head-anchor {
      @include size(100, 100, #{$avatar-size-units});
      @include position(-33, -105, #{$avatar-size-units});
      transform-origin: calc(60 * #{$avatar-size-units})
        calc(105 * #{$avatar-size-units});
      z-index: 1;

      .face {
        @include size(113, 120, #{$avatar-size-units});
        @include bodyPart();
        @include position(2, 0, #{$avatar-size-units});
        z-index: -1;
      }
      .head-wear {
        @include size(460, 460, #{$avatar-size-units});
        @include position(-175, -130, #{$avatar-size-units});
        z-index: 5;
      }
      .ear {
        @include bodyPart();
        @include size(50, 80, #{$avatar-size-units});
        @include position(-18, 30, #{$avatar-size-units});
        z-index: 3;
      }
      .eyes {
        @include size(100, 63, #{$avatar-size-units});
        @include position(23, 33, #{$avatar-size-units});
        @include bodyPart();
        z-index: 3;
      }
      .hair {
        @include bodyPart();
        @include size(250, 300, #{$avatar-size-units});
        @include position(-87, -96, #{$avatar-size-units});
        z-index: 2;
      }
      .mouth {
        @include size(50, 50, #{$avatar-size-units});
        @include position(49, 75, #{$avatar-size-units});
        background: no-repeat center center;
        background-size: 100%;
        z-index: 3;
      }
    }

    .arm-anchor {
      &.left {
        @include position(25, 0, #{$avatar-size-units});
        transform-origin: calc(30 * #{$avatar-size-units})
          calc(10 * #{$avatar-size-units});

        .forearm {
          @include size(29, 40, #{$avatar-size-units});
          @include position(13, 6, #{$avatar-size-units});
          @include bodyPart();
        }
        .hand {
          @include size(25, 23, #{$avatar-size-units});
          @include position(13, 41, #{$avatar-size-units});
          @include bodyPart();
        }
        .fingers {
          @include size(24, 22, #{$avatar-size-units});
          @include position(14, 42, #{$avatar-size-units});
          @include bodyPart();
        }
      }
      &.right {
        z-index: 2;
        @include position(-25, 0, #{$avatar-size-units});
        transform-origin: calc(35 * #{$avatar-size-units})
          calc(15 * #{$avatar-size-units});

        .forearm {
          @include size(29, 40, #{$avatar-size-units});
          @include position(13, 6, #{$avatar-size-units});
          @include bodyPart();
        }
        .hand {
          @include size(28, 25, #{$avatar-size-units});
          @include position(12, 40, #{$avatar-size-units});
          @include bodyPart();
          transform: rotate(72deg);
        }
      }
    }

    .leg-anchor {
      &.left {
        @include position(15, 45, #{$avatar-size-units});
        transform-origin: calc(30 * #{$avatar-size-units})
          calc(10 * #{$avatar-size-units});

        .hip {
          @include size(29, 30, #{$avatar-size-units});
          @include position(13, 11, #{$avatar-size-units});
          @include bodyPart();
        }
        .foot {
          @include size(30, 25, #{$avatar-size-units});
          @include position(18, 30, #{$avatar-size-units});
          @include bodyPart();
        }
      }

      &.right {
        z-index: 3;
        @include position(-12, 45, #{$avatar-size-units});
        transform-origin: calc(30 * #{$avatar-size-units})
          calc(10 * #{$avatar-size-units});

        .hip {
          @include size(29, 30, #{$avatar-size-units});
          @include position(13, 11, #{$avatar-size-units});
          @include bodyPart();
        }
        .foot {
          @include size(30, 25, #{$avatar-size-units});
          @include position(12, 30, #{$avatar-size-units});
          @include bodyPart();
        }
      }
    }

    .torso {
      @include size(57, 65, #{$avatar-size-units});
      @include bodyPart();
    }

    .skin-color {
      @include filter-fix();
    }

    .hair-color {
      @include filter-fix();
    }
  }
}

$size-huge: 16rem;
$size-large: 12rem;
$size-normal: 9rem;
$size-small: 6rem;
$size-tiny: 5.4rem;
$size-relative: calc(0.1 * var(--app-min-size));

.avatar-wrapper {
  overflow: hidden !important;

  &.flipped {
    transform: scaleX(-1);
  }

  &.head-only {
    &.huge {
      width: $size-huge;
      min-width: $size-huge;
      height: $size-huge;
    }

    &.large {
      width: $size-large;
      min-width: $size-large;
      height: $size-large;
    }

    &.normal {
      width: $size-normal;
      min-width: $size-normal;
      height: $size-normal;
    }

    &.small {
      width: $size-small;
      min-width: $size-small;
      height: $size-small;
    }

    &.tiny {
      //width: $size-tiny;
      //min-width: $size-tiny;
      //height: $size-tiny;
      width: 4.75rem;
      min-width: 4.75rem;
      height: 4.75rem;
    }
  }
}

.avatar-wrapper.frame {
  .player-avatar {
    background: $avatar-bg-color;
  }
}

.player-avatar {
  overflow: hidden;
  @include filter-fix();

  &.head-only {
    .avatar-body-wrapper {
      overflow: hidden;
      position: relative;
      height: 200%;
      width: 200%;
      margin-left: -50%;
      margin-top: -90%;
      pointer-events: none;
    }
  }

  &.huge {
    @include player-avatar($size-huge - 1.2rem);
  }
  &.large {
    @include player-avatar($size-large - 1.2rem);
  }
  &.normal {
    @include player-avatar($size-normal - 1.2rem);
  }
  &.small {
    @include player-avatar($size-small - 1.2rem);
  }
  &.tiny {
    @include player-avatar($size-tiny - 1.2rem);
  }
  &.relative {
    @include player-avatar(#{$size-relative});
  }
}

.avatar-text {
  right: 14%;
  bottom: 7%;
  z-index: 2;
  position: absolute;
  @include text-outline();
}
</style>
