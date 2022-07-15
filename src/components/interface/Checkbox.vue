<template>
  <label class="checkbox-label" :class="{ disabled: disabled }">
    <input
      type="checkbox"
      v-model="internalValue"
      ref="checkbox"
      @click="mouseClick()"
    />
    <span class="text"><slot></slot></span>
  </label>
</template>

<script>
import checkboxSound from "../../assets/sounds/checkbox.ogg";

export default {
  props: {
    value: {},
    disabled: {},
  },

  data: () => ({
    internalValue: null,
    uniqueId: null,
  }),

  mounted() {
    setTimeout(() => {
      // workaround for browser "back" navigation
      if (
        this.$refs.checkbox &&
        !!this.$refs.checkbox.checked !== !!this.internalValue
      ) {
        this.$refs.checkbox.checked = this.internalValue;
      }
    });
  },

  watch: {
    value: {
      handler() {
        this.internalValue = this.value;
      },
      immediate: true,
    },
    internalValue: {
      handler() {
        this.$emit("input", this.internalValue);
      },
      immediate: true,
    },
  },

  methods: {
    mouseClick() {
      SoundService.playSound(checkboxSound);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.checkbox-label {
  cursor: pointer;
  display: flex;
  padding: 0;

  .text {
    font-style: italic;
    margin-top: 0.75rem;
    line-height: 2rem;
  }

  &.disabled {
    @include disabled();
    pointer-events: none;
  }
}

input[type="checkbox"] {
  $size: 2.5rem;
  appearance: none;
  background-color: transparent;
  box-shadow: none;
  width: $size;
  min-width: $size;
  max-width: $size;
  height: $size;
  min-height: $size;
  max-height: $size;
  display: inline-block;
  position: relative;
  margin: 0.5rem 1rem 0.5rem 0.5rem;
  padding: 0;
  border: none;
  cursor: pointer;
  outline: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: url(ui-asset("/misc/checkbox_off.png"));
    background-size: 100%;
    background-repeat: no-repeat;
  }

  &:checked::before {
    background-image: url(ui-asset("/misc/checkbox.png"));
  }

  &[disabled]::before {
    //@include disabled();
  }
}
</style>
