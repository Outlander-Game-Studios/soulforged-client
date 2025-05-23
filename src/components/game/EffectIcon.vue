<template>
  <div class="effect-icon" :class="effect.name || effect.text" @click="mouseClick($event)">
    <Icon
      :backgroundType="effect.severity !== undefined ? 'severity-' + effect.severity : 'severity-0'"
      v-if="effect"
      :src="effect.icon"
      :size="size"
    >
      <template v-slot:textBottomRight>
        <span v-if="text" class="top-text">
          {{ text[0] }}<span class="top-text-extra">{{ text[1] }}</span>
        </span>
      </template>
      <template v-slot:textTopRight>
        <span class="duration-turns">
          {{ effect.durationTurns }}
        </span>
      </template>
    </Icon>
  </div>
</template>

<script>
import iconClickSound from '../../assets/sounds/icon-click.mp3'

export default {
  props: {
    effect: {},
    size: {},
  },

  methods: {
    formatNumber: global.formatNumber,
    mouseClick($event) {
      if (!!this.$attrs.onClick) {
        this.$emit('click', $event)
        SoundService.playSound(iconClickSound)
      }
    },
  },

  computed: {
    text() {
      if (this.effect.stacks) {
        if (this.effect.stackDisplay === EFFECTS.STACK_DISPLAY.PERCENT) {
          return [`${(100 * this.effect.stacks).toFixed(0)}%`]
        } else if (this.effect.stackDisplay === EFFECTS.STACK_DISPLAY.HIDE) {
          return ['']
        }
        return [formatNumber(this.effect.stacks)]
      }
      if (this.effect.level !== undefined) {
        if (this.effect.baseLevel && this.effect.baseLevel !== this.effect.level) {
          return [`${this.effect.level} / ${this.effect.baseLevel}`]
        }
        if (this.effect.level >= 9999) {
          return [formatNumber(this.effect.level)]
        }
        if (`${this.effect.level}`.includes('.') && this.effect.level < 1000) {
          const values = `${this.effect.level}`.split('.')
          return [values[0], '.' + values[1]]
        }
        const floored = Math.floor(this.effect.level)
        if (isNaN(floored)) {
          return [this.effect.level]
        }
        return [floored]
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.top-text {
  white-space: nowrap;
  display: inline;

  .top-text-extra {
    font-size: 50%;
    height: 0;
    display: inline-block;
    overflow: visible;
  }
}
.duration-turns {
  @include utils.text-outline(#021000, #79ff51);
}
</style>
