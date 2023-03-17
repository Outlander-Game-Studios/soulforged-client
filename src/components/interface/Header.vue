<template>
  <div
    class="header-component"
    :class="{
      alt: alt,
      alt2: alt2,
      alt3: alt3,
      flex: flex,
      small: small,
      large: large,
      'very-large': veryLarge,
    }"
    @click="mouseClick()"
  >
    <div class="header-border">
      <div class="header-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import buttonClickSound from "../../assets/sounds/button-click.ogg";

export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    veryLarge: {
      type: Boolean,
      default: false,
    },
    flex: {
      type: Boolean,
    },
    alt: {
      type: Boolean,
      default: false,
    },
    alt2: {
      type: Boolean,
      default: false,
    },
    alt3: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    mouseClick() {
      if (!!this.$listeners.click) {
        this.$emit("click");
        SoundService.playSound(buttonClickSound);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "sass:map";
@import "../../utils";

.header-component {
  position: relative;
  margin: 0;
  font-size: 2.25rem;
  z-index: 5;

  .header-border {
    $border-size: 0.75rem;
    border: $border-size solid #ff0000;
    text-align: center;
    @include theme-header-border();
    z-index: -1;

    .header-content {
      @include theme-header-background();
    }
  }

  &.small {
    font-size: 1.75rem;
  }
  &.large {
    font-size: 2.5rem;
    .header-content {
      padding: 0.3rem 1rem;
    }
  }
  &.very-large {
    font-size: 4rem;
    .header-content {
      padding: 0 1.5rem;
    }
  }

  &.flex {
    display: flex;
  }

  &.alt {
    .header-border {
      @include theme-header-border-alt();

      .header-content {
        @include theme-header-background-alt();
      }
    }
  }

  &.alt2 {
    .header-border {
      @include theme-header-border-alt2();

      .header-content {
        @include theme-header-background-alt2();
      }
    }
  }

  &.alt3 {
    .header-border {
      @include theme-header-border-alt3();

      .header-content {
        @include theme-header-background-alt3();
      }
    }
  }
}
</style>
