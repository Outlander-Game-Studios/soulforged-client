<template>
  <label class="radio-label" :class="{ disabled: disabled }">
    <input type="radio" v-model="internalValue" :value="option" ref="radio" @change="select()" />
    <span class="text"><slot></slot></span>
  </label>
</template>

<script>
import checkboxSound from '../../assets/sounds/checkbox.mp3'

export default {
  props: {
    value: {},
    option: {},
    disabled: {},
  },

  data: () => ({
    internalValue: null,
    uniqueId: null,
  }),

  watch: {
    value: {
      handler() {
        this.internalValue = this.value
      },
      immediate: true,
    },
    internalValue: {
      handler() {},
    },
  },

  methods: {
    select() {
      SoundService.playSound(checkboxSound)
      this.$emit('update:value', this.option)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.radio-label {
  cursor: pointer;
  display: flex;
  padding: 0;

  .text {
    font-style: italic;
    margin-top: 0.25rem;
    line-height: 3rem;
  }

  &.disabled {
    pointer-events: none;
    @include utils.disabled();
  }
}

input[type='radio'] {
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
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: utils.ui-asset('/misc/radio_off.png');
    background-size: 100%;
    background-repeat: no-repeat;
  }

  &:checked::before {
    background-image: utils.ui-asset('/misc/radio.png');
  }

  &[disabled]::before {
    //@include utils.disabled();
  }
}
</style>
