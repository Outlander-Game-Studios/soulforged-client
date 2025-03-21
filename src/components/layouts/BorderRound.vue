<template>
  <div class="border-round-container" :style="style" :class="['border-' + borderType]">
    <div class="contents" :class="'background-' + backgroundType">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 5,
    },
    borderType: {
      default: 'base',
      validator: PropValidator.oneOf(['base', 'secondary', 'tight', 'tightGlow']),
    },
    backgroundType: {
      default: 'alt',
      validator: PropValidator.oneOf(['base', 'alt', 'alt2', 'important']),
    },
  },

  computed: {
    style() {
      return {
        width: this.size + 'rem',
        height: this.size + 'rem',
        fontSize: (this.size * 2) / 3 + 'rem',
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.border-round-container {
  box-sizing: border-box;
  height: 100%;
  border-width: 0;
  border-radius: 50%;
  position: relative;
  background-size: 100% 100%;

  * {
    font-size: 100%;
  }

  .contents {
    text-align: center;
    overflow: hidden;
    border-radius: 50%;
    border-style: solid;
    border-width: 0;
    border-color: transparent;
  }

  &.border-base {
    background-image: utils.ui-asset('/borders/round_fr.jpg');
    .contents {
      $borderSize: 0.12em; // depends on the image used
      @include utils.fill($borderSize);
      line-height: 1.5em - $borderSize * 2;
    }
  }
  &.border-secondary {
    background-image: utils.ui-asset('/borders/hero_icon_frame.jpg');
    .contents {
      $borderSize: 0.1em; // depends on the image used
      @include utils.fill($borderSize);
      line-height: 1.5em - $borderSize * 2;
    }
  }
  &.border-tight {
    background-image: utils.ui-asset('/borders/little_round_frame2.jpg');
    .contents {
      $borderSize: 0.22em; // depends on the image used
      @include utils.fill($borderSize);
      line-height: 1.5em - $borderSize * 2;
    }
  }
  &.border-tightGlow {
    background-image: utils.ui-asset('/borders/little_round_frame2_elite.jpg');
    .contents {
      $borderSize: 0.22em; // depends on the image used
      @include utils.fill($borderSize);
      line-height: 1.5em - $borderSize * 2;
    }
  }
}
</style>
