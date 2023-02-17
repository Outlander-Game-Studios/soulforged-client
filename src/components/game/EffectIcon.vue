<template>
  <div
    class="effect-icon"
    :class="effect.name || effect.text"
    @click="mouseClick($event)"
  >
    <Icon
      :backgroundType="
        effect.severity !== undefined
          ? 'severity-' + effect.severity
          : 'severity-0'
      "
      v-if="effect"
      :src="effect.icon"
      :size="size"
      :text="{ bottomRight: text }"
    >
      <template v-slot:textTopRight>
        <span class="duration-turns">
          {{ effect.durationTurns }}
        </span>
      </template>
    </Icon>
  </div>
</template>

<script>
import { formatNumber } from "../../../common/utils/misc.js";
import iconClickSound from "../../assets/sounds/icon-click.ogg";

export default {
  props: {
    effect: {},
    size: {},
  },

  methods: {
    formatNumber,
    mouseClick($event) {
      if (!!this.$listeners.click) {
        this.$emit("click", $event);
        SoundService.playSound(iconClickSound);
      }
    },
  },

  computed: {
    text() {
      if (this.effect.stacks) {
        if (this.effect.stackDisplay === EFFECTS.STACK_DISPLAY.PERCENT) {
          return `${(100 * this.effect.stacks).toFixed(0)}%`;
        } else if (this.effect.stackDisplay === EFFECTS.STACK_DISPLAY.HIDE) {
          return "";
        }
        return formatNumber(this.effect.stacks);
      }
      if (this.effect.level !== undefined) {
        if (
          this.effect.baseLevel &&
          this.effect.baseLevel !== this.effect.level
        ) {
          return `${this.effect.level} / ${this.effect.baseLevel}`;
        }
        return this.effect.level;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.duration-turns {
  @include text-outline(#021000, #79ff51);
}
</style>
