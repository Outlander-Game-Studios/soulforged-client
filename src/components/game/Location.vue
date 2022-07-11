<template>
  <div v-if="!location">
    <LoadingPlaceholder />
  </div>
  <div v-else-if="location.indoors">
    <slot />
  </div>
  <div v-else class="visible-map framed" :class="visibleMapClass">
    <transition name="fade">
      <div v-if="loading" class="loading-texture-wrapper">
        <div class="loading-texture" />
      </div>
    </transition>
    <img
      v-show="!loading"
      :key="location.id"
      class="location-image"
      draggable="false"
      :src="getLocationImgPath()"
    />
    <div class="slot-wrapper">
      <slot />
    </div>
    <div class="glow"></div>
    <div
      class="current-location"
      @click="openLocationTab()"
      v-if="myCreature && !small && !location.indoors"
    />
    <div v-for="path in paths" class="path" :style="pathStyle(path)">
      <Actions :target="path" class="action">
        <template v-slot:travel>
          <div
            class="travel-arrow"
            :class="getArrowClass(path)"
            @click="arrowClick(path, $event)"
          />
        </template>
      </Actions>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    highlightId: {},
    small: {
      type: Boolean,
    },
    validPathIds: {
      default: null,
    },
  },

  data: () => ({
    loading: true,
    imageUpdate: "",
  }),

  subscriptions() {
    return {
      shrink: ControlsService.getCurrentOpenTabStream().map((tab) => !!tab),
      mainEntity: GameService.getRootEntityStream(),
      locationUpdate: GameService.getRootEntityStream()
        .map((entity) => ({
          skills: entity?.skills,
        }))
        .distinctUntilChanged(undefined, JSON.stringify)
        .tap(() => {
          this.paths
            ?.filter((path) => {
              const pathLocationId = path.fromLocationId;
              const locationId = this.mainEntity?.location;
              return pathLocationId === locationId;
            })
            .forEach((path) =>
              GameService.getEntityStream(path.id, ENTITY_VARIANTS.BASE, true)
            );
        }),
      location: GameService.getLocationStream(),
      ambientSound: GameService.getLocationStream()
        .map((location) => location.ambientSound)
        .tap((ambientSound) => SoundService.playMusic(ambientSound)),
      paths: GameService.getLocationStream()
        .map(({ id, paths }) => ({ id, paths }))
        .distinctUntilChanged(null, JSON.stringify)
        .switchMap(({ paths }) =>
          GameService.getEntitiesStream(paths, ENTITY_VARIANTS.BASE, true)
        ),
      myCreature: GameService.getMyCreatureStream(),
      locationImageUpdate: GameService.getMapImageUpdateStream().tap(() => {
        this.imageUpdate += "?";
      }),
    };
  },

  computed: {
    visibleMapClass() {
      if (this.small) {
        return "small";
      }
      if (this.shrink) {
        return "shrink";
      }
      return "normal";
    },

    travelPathId() {
      return (
        this.mainEntity &&
        this.mainEntity.operation &&
        this.mainEntity.operation.type === "TravelOperation" &&
        this.mainEntity.operation.context &&
        this.mainEntity.operation.context.pathId
      );
    },
  },

  methods: {
    openLocationTab() {
      ControlsService.triggerControlEvent("openPanel-location");
    },

    getLocationImgPath() {
      const imageUrl =
        GameService.getLocationImgPath(this.location) + this.imageUpdate;
      if (imageUrl && this.lastImageUrl !== imageUrl) {
        this.loadImage(imageUrl);
        this.lastImageUrl = imageUrl;
      }
      return imageUrl;
    },

    loadImage(path) {
      this.loading = true;

      const preloaderImg = document.createElement("img");
      preloaderImg.src = path;

      preloaderImg.addEventListener("load", () => {
        this.loading = false;
        preloaderImg.remove();
      });
      preloaderImg.addEventListener("error", (...args) => {
        console.error("Error loading location image");
        setTimeout(() => {
          this.imageUpdate += "?";
        }, 1000);
      });
    },

    pathStyle(path) {
      return {
        transform: `rotate(${180 + path.position}deg)`,
      };
    },

    arrowClick(path, $event) {
      SoundService.playSound(SoundService.SOUNDS.TRAVEL);
      if (this.$listeners.selected) {
        this.$emit("selected", path);
        $event.stopPropagation();
        return;
      }
      if (path.id === this.travelPathId) {
        GameService.request(REQUEST_CODES.COMMENCE_OPERATION, {
          locationId: this.mainEntity.location,
        }).then(({ statusChanges = [] } = {}) => {
          ToastNotify(statusChanges);
        });
        $event.stopPropagation();
      }
    },

    getArrowClass(path) {
      const invalid =
        !!this.validPathIds && !this.validPathIds.includes(path.id);
      return [
        "difficulty-" + path.accidentGrade,
        "path-" + path.id,
        {
          invalid,
          current:
            this.travelPathId === path.id || this.highlightId === path.id,
          backtrack: path.isBacktracking,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

@keyframes current-arrow {
  0% {
    margin-left: 0;
  }
  50% {
    margin-left: 12%;
  }
  100% {
    margin-left: 0;
  }
}

@keyframes slide-texture {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.loading-texture-wrapper {
  z-index: 1;
  position: absolute;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.loading-texture {
  background-image: url(ui-asset("/clouds-1.jpg"));
  background-size: 50% 100%;
  background-repeat: round;
  width: 200%;
  height: 100%;
  animation: slide-texture 12s linear infinite;
}

$transition-time: 120ms;

@mixin visible-map-style($size) {
  $border-width: #{calc(0.067 * #{$size})};
  position: relative;
  width: $size;
  height: $size;
  margin: 0 auto;

  &.framed {
    border: $border-width solid transparent;
    box-sizing: border-box;
    background-image: url(ui-asset("/borders/hero_icon_frame.png"));
    background-size: calc(100% + calc(2 * #{$border-width}))
      calc(100% + calc(2 * #{$border-width}));
    background-position: center center;
    background-repeat: no-repeat;
  }

  .current-location {
    position: absolute;
    top: 50%;
    left: 50%;
    $locationSize: calc(0.05 * #{$size});
    margin-left: calc(#{$locationSize} * -1.05);
    margin-top: calc(#{$locationSize} * -1.65);
    width: calc(#{$locationSize} * 2);
    height: calc(#{$locationSize} * 2);
    overflow: hidden;
    cursor: pointer;

    background: url(ui-asset("/misc/flag_blue.png"));
    background-size: 100% 100%;

    &:hover {
      @include filter(brightness(1.4) saturate(1.4));
    }
  }

  > .path {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 0;
    z-index: 2;
    transform-origin: left;
    overflow: visible;

    .action {
      transform: translateX(calc(#{$size} * 0.4));
      transition: transform $transition-time ease-out;
    }

    .travel-arrow {
      $arrowSize: calc(#{$size} * 0.13);
      height: $arrowSize;
      width: $arrowSize;

      margin-top: calc(#{$arrowSize} / -2);
      cursor: pointer;
      background-size: 100% 100%;
      transition: all $transition-time ease-out;
      transition-property: margin, width, height, transform;
      position: relative;

      &.invalid {
        @include filter(saturate(0));
      }

      &.backtrack {
        &::before {
          content: "";
          position: absolute;
          $overlap: 10%;
          top: $overlap;
          left: $overlap;
          width: 100% - 2 * $overlap;
          height: 100% - 2 * $overlap;
          opacity: 1;
          transform: rotate(45deg);

          background-image: url(ui-asset("/borders/reinforced.png"));
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }

      @for $i from 0 through 5 {
        &.difficulty-#{$i} {
          background-image: url(ui-asset("/misc/travel-#{$i}.png"));
        }
      }

      &.current {
        animation: current-arrow 1s ease-in-out infinite;
      }

      &:hover {
        cursor: pointer;
        @include filter(brightness(1.7));
      }
    }
  }
}

.visible-map {
  top: 0;
  right: 0;
  transition: all $transition-time ease-out;

  &.normal {
    @include visible-map-style(calc(0.75 * var(--app-min-size)));
  }

  &.small {
    @include visible-map-style(20rem);
  }

  &.shrink {
    @media (orientation: landscape) {
      @include visible-map-style(
        min(var(--app-height) - 22rem, 1 * var(--app-width) - 40rem - 2rem)
      );
      top: 5rem;
      right: 17rem;
    }

    @media (orientation: portrait) {
      @include visible-map-style(
        min(var(--app-width) - 5rem, 1 * var(--app-height) - 40rem - 16rem)
      );
      margin-top: -27rem;
    }
  }

  .location-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.extra-actions {
  position: absolute;
  bottom: 0;
  left: 0;
}

.glow {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  top: 0;
  position: absolute;
  pointer-events: none;

  $spacing: 2%;
  &:before {
    content: "";
    position: absolute;
    top: $spacing;
    left: $spacing;
    right: $spacing;
    bottom: $spacing;
    border-radius: 100%;
    @include filter(blur(0.15rem));
    z-index: 2;
    transform: rotateZ(-30deg);
    background: radial-gradient(
      circle at 50% 80%,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 74%,
      rgba(255, 255, 255, 0.7) 80%,
      rgba(255, 255, 255, 0.7) 84%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  &:after {
    content: "";
    position: absolute;
    top: $spacing;
    left: $spacing;
    right: $spacing;
    bottom: $spacing;
    border-radius: 100%;
    @include filter(blur(0.15rem));
    z-index: 2;
    transform: rotateZ(150deg);
    background: radial-gradient(
      circle at 50% 70%,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 74%,
      rgba(255, 255, 255, 0.4) 80%,
      rgba(255, 255, 255, 0.4) 84%,
      rgba(255, 255, 255, 0) 100%
    );
  }
}

.slot-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}
</style>
