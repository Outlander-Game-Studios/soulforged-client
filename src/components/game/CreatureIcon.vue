<template>
  <div
    v-if="internalCreature"
    class="creature-icon-wrapper"
    :class="{ dead: internalCreature.dead, interactive: hasClick }"
    @click="mouseClick($event)"
  >
    <Avatar
      v-if="internalCreature.avatar"
      :creature="internalCreature"
      :flipped="internalCreature.hostile"
      :headOnly="true"
      :size="size"
      :noFrame="noFrame"
      :text="internalCreature.number"
      :noSleep="noSleep"
    />
    <Icon
      v-else
      :noFrame="noFrame"
      :src="internalCreature.icon"
      :flipped="internalCreature.hostile"
      :size="iconSize"
      :text="{ bottomRight: internalCreature.number }"
      :backgroundType="internalCreature.hostile ? 'danger' : 'alt2'"
    />
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
import iconClickSound from "../../assets/sounds/icon-click.ogg";

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
  },

  subscriptions() {
    return {
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
    z-index: 10;
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
</style>
