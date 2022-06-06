<template>
  <button
    @click="click($event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseout="$emit('mouseout', $event)"
    :disabled="isDisabled"
    :class="[
      { processing: processingOn },
      { highlighted: highlighted },
      { 'no-padding': noPadding },
      'type-' + type,
    ]"
  >
    <div class="content">
      <div class="text">
        <slot></slot>
      </div>
    </div>
    <Spinner
      class="processing-spinner"
      v-if="processingOn"
      :size="3"
      color="white"
    />
  </button>
</template>

<script>
import buttonClickSound from "../../assets/sounds/button-click.ogg";

export default {
  props: {
    processing: null,
    highlighted: false,
    disabled: false,
    type: null,
    noPadding: {
      type: Boolean,
    },
  },

  data: () => ({
    processingOn: false,
  }),

  watch: {
    processing: {
      handler(promise) {
        if (!promise) {
          this.processingOn = false;
          return;
        }
        this.processingOn = true;
        if (typeof promise === "boolean") {
          this.processingOn = promise;
        } else {
          promise
            .then(() => {
              this.processingOn = false;
            })
            .catch(() => {
              this.processingOn = false;
            });
        }
      },
      immediate: true,
    },
  },

  computed: {
    isDisabled() {
      return this.disabled;
    },
  },

  methods: {
    click($event) {
      if (!this.isDisabled) {
        SoundService.playSound(buttonClickSound);
        this.$emit("click", $event);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "sass:map";
@import "../../utils";

button {
  @include interactive();
  padding: 0;
  border: 0;
  background-color: transparent;
  outline: none;
  position: relative;

  &.highlighted {
    .content {
      @include filter(brightness(1.2) saturate(1.2));
      box-shadow: 0 0 0.3rem 0.3rem steelblue;
    }
  }

  &.type-accept {
    @include filter(hue-rotate(70deg));
  }
  &.type-reject {
    @include filter(hue-rotate(327deg) saturate(1.5));
  }

  &.no-padding {
    .content {
      padding: 0;
    }
  }

  &[disabled] {
    @include disabled();
    pointer-events: none;
  }

  &.processing {
    pointer-events: none;

    .text {
      opacity: 0.2;
    }
  }

  .content {
    position: relative;
    font-size: 2rem;
    padding: 0.25rem 0.5rem;
    color: #eee;
    border-width: 1rem;
    border-style: solid;
    border-radius: 1rem;
    @include text-outline();
    @include theme-button();
  }

  .processing-spinner {
    position: absolute;
    top: 1rem;
    left: 50%;
    margin-left: -1.5rem;
  }

  &:active,
  &.active {
    .content {
      @include theme-button-pressed();
    }
  }
}
</style>
