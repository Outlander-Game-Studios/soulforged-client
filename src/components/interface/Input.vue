<template>
  <Vertical :class="{ disabled: disabled }">
    <Container backgroundType="base" borderType="alt2" v-show="!noInputElement">
      <input
        class="input main"
        v-model="localValue"
        :type="type"
        :disabled="disabled"
        :placeholder="placeholder"
        ref="main"
        @focus="onFocus($event)"
        @keydown="onKeypress($event)"
      />
    </Container>
    <div v-if="maxLength && localValue.length > maxLength" class="error-text">
      Value needs to be shorter than {{ maxLength }} characters.
    </div>
    <Slider
      v-if="type === 'number' && max !== null"
      v-model:value="localValue"
      :disabled="disabled"
      :step="step"
      :min="min"
      :max="max"
    />
  </Vertical>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
    },
    type: {
      default: 'text',
    },
    min: {
      default: 0,
    },
    max: {
      default: null,
    },
    maxLength: {},
    step: {
      type: Number,
      default: 1,
    },
    noInputElement: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    noSelectOnFocus: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    placeholder: {},
  },

  data: () => ({
    localValue: '',
  }),

  watch: {
    max() {
      this.checkNumber()
    },
    min() {
      this.checkNumber()
    },
    value: {
      handler(arg) {
        if (this.type === 'number') {
          this.checkNumber()
        } else {
          this.localValue = arg
        }
      },
      immediate: true,
    },
    localValue: {
      handler(arg) {
        this.$emit('update:value', arg)
      },
    },
  },

  mounted() {
    if (this.autoFocus && !ControlsService.isTouchDevice()) {
      this.focus()
    }
  },

  methods: {
    onKeypress($event) {
      this.$emit('keypress', $event)
      if (($event.key || $event.code) === 'Enter') {
        this.$emit('enter', $event)
      }
    },

    onFocus() {
      if (!this.noSelectOnFocus) {
        this.$refs.main?.select()
      }
    },

    focus() {
      this.$refs.main.focus()
      setTimeout(() => {
        this.onFocus()
      })
    },

    checkNumber() {
      if (!this.value && this.value !== 0) {
        return
      }
      this.localValue = Math.limit(+this.value, this.min, this.max === null ? Infinity : this.max)
      this.$emit('update:value', this.localValue)
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.input.main {
  font-size: 2rem;
  background: beige;
  display: block;
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-radius: 0;
  margin: 0;

  &::selection {
    color: white;
    background: saddlebrown;
  }
}

.disabled {
  pointer-events: none;
  @include utils.disabled();
}
</style>
