<template>
  <div
    v-if="internalCreature"
    class="creature-icon-wrapper"
    :class="{ dead: internalCreature.dead, 'interactive-alt': hasClick }"
    @click="mouseClick($event)"
  >
    <Avatar
      v-if="internalCreature.avatar"
      :creature="internalCreature"
      :flipped="internalCreature.hostile"
      :headOnly="true"
      :size="size"
      :noFrame="noFrame"
      :noSleep="noSleep"
    />
    <Icon
      v-else
      :noFrame="noFrame"
      :src="internalCreature.icon"
      :flipped="internalCreature.hostile"
      :size="iconSize"
      :text="{ bottomRight: internalCreature.number }"
      :backgroundType="backgroundType"
    />
    <NextMoveIndicator
      v-if="moveIndicator"
      class="move-indicator"
      :moveData="internalCreature.nextMove"
    />
    <div class="elite-icon" v-if="internalCreature.eliteIcon">
      <img :src="internalCreature.eliteIcon" />
    </div>
    <div
      v-if="!!internalCreature.operationInfo && !noOperation"
      class="operation-indicator"
      :class="{ round: !operationIsPng }"
      :style="operationIndicatorStyle"
    >
      <img :src="internalCreature.operationInfo.icon" />
    </div>
  </div>
</template>

<script>
import iconClickSound from "../../assets/sounds/icon-click.mp3";

export default {
  props: {
    creature: {},
    creatureId: {},
    noFrame: {
      default: false,
    },
    noSleep: {
      type: Boolean,
      default: false,
    },
    noOperation: {
      type: Boolean,
      default: false,
    },
    size: {
      default: "small",
      validator: PropValidator.oneOf([
        "huge",
        "large",
        "normal",
        "small",
        "tiny",
      ]),
    },
    moveIndicator: {
      type: Boolean,
      default: false,
    },
  },

  subscriptions() {
    return {
      mainEntity: GameService.getRootEntityStream(),
      internalCreature: Rx.combineLatest(
        this.$stream("creature"),
        this.$stream("creatureId")
      ).switchMap(([creature, creatureId]) =>
        creature
          ? Rx.Observable.of(creature)
          : GameService.getEntityStream(creatureId)
      ),
    };
  },

  computed: {
    backgroundType() {
      if (this.internalCreature.nextMove) {
        const { targetId } = this.internalCreature.nextMove;
        if (targetId === this.mainEntity.id) {
          return "danger";
        } else {
          return "danger-low";
        }
      }
      if (!this.internalCreature) {
        return;
      }
      if (!this.internalCreature.hostile) {
        return "alt2";
      }
      if (this.internalCreature.nonAggressive) {
        return "danger-low";
      }
      return "danger";
    },

    operationIndicatorStyle() {
      return {
        fontSize: this.iconSize / 2.5 + "rem",
      };
    },

    hasClick() {
      return !!this.$listeners.click;
    },

    operationIsPng() {
      return this.internalCreature?.operationInfo?.icon?.match(/\.png$/);
    },

    iconSize() {
      switch (this.size) {
        case "huge":
          return 16;
        case "large":
          return 12;
        case "normal":
          return 9;
        case "small":
          return 6;
        case "tiny":
          return 4;
      }
    },
  },

  methods: {
    mouseClick($event) {
      if (!!this.$listeners.click) {
        this.$emit("click", $event);
        SoundService.playSound(iconClickSound);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.creature-icon-wrapper {
  position: relative;

  .operation-indicator {
    position: absolute;
    bottom: -0.1em;
    right: -0.1em;
    width: 0.9em;
    height: 0.9em;
    z-index: 21;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    overflow: hidden;
    @include filter(drop-shadow(0.2rem 0.2rem 0.1rem #111));

    &.round {
      width: 0.7em;
      height: 0.7em;

      img {
        border: 0.06em solid #a58471;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }

    img {
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
  }

  &.dead {
    transition: filter 1s linear, opacity 1s linear;
    @include filter(saturate(0) brightness(0.8));
    opacity: 0.4;
  }
}

.move-indicator {
  position: absolute;
  top: calc(100% - 2.5rem);
  left: -1.5rem;
}

.elite-icon {
  img {
    width: 32%;
    height: auto;
    position: absolute;
    top: 11%;
    left: 9%;
  }
}
</style>
