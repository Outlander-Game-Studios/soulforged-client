<template>
  <div class="icon-wrapper" :class="{ 'no-frame': noFrame }" :style="iconWrapperStyle">
    <BorderRound
      v-if="round"
      :size="size"
      :borderType="borderType"
      :backgroundType="backgroundType"
    >
      <div class="icon" :style="iconStyle" />
    </BorderRound>
    <Container
      v-else
      class="container"
      :borderType="borderType"
      :borderSize="size / 10"
      :backgroundType="backgroundType"
      :customStyle="customStyle"
    >
      <div class="icon" :class="{ flipped: flipped }" :style="iconStyle" />
      <div
        v-if="$slots.textBottomRight || (text && text.bottomRight)"
        class="text bottom-right"
        :style="textStyle"
      >
        <slot name="textBottomRight" />
        {{ text && text.bottomRight }}
      </div>
      <div
        v-if="$slots.textTopRight || (text && text.topRight)"
        class="text top-right"
        :style="textStyle"
      >
        <slot name="textTopRight" />
        {{ text && text.topRight }}
      </div>
      <slot />
    </Container>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 8,
    },
    flipped: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    borderType: {
      default: 'base',
    },
    backgroundType: {
      default: 'alt2',
    },
    noFrame: {
      type: Boolean,
      default: false,
    },
    customStyle: {},
    text: {},
    src: {},
  },

  computed: {
    iconWrapperStyle() {
      return {
        width: this.size + 'rem',
        height: this.size + 'rem',
        'min-width': this.size + 'rem',
        'min-height': this.size + 'rem',
        fontSize: (this.size * 2) / 3 + 'rem',
      }
    },

    iconStyle() {
      if (!this.src) {
        return {}
      }
      return {
        backgroundImage: `url("${this.src}")`,
      }
    },

    textStyle() {
      const minSize = 0.9
      const size = Math.max(minSize, this.size / 3)
      return {
        'line-height': size + 'rem',
        'font-size': size + 'rem',
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.icon-wrapper {
  overflow: hidden;
  position: relative;

  &.no-frame {
    .border-container {
      border-image: none;
      border-color: transparent;
      background: none;
    }
  }

  .icon {
    background-size: 100% 100%;
    background-repeat: round;
    background-blend-mode: overlay;
    height: 100%;

    &.flipped {
      transform: scaleX(-1);
    }
  }

  .container {
    position: relative;
    overflow: hidden;
  }
  .text {
    position: absolute;
  }
  .bottom-right {
    right: 5%;
    bottom: 2%;
    @include utils.text-outline();
    z-index: 2;
  }
  .top-right {
    right: 5%;
    top: 2%;
    @include utils.text-outline();
    z-index: 2;
  }
}
</style>
