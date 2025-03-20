<template>
  <Container backgroundType="base" borderType="alt2" :class="{ disabled: disabled }">
    <textarea
      class="textarea main"
      v-model="localValue"
      :disabled="disabled"
      :placeholder="placeholder"
      ref="main"
      @focus="$event.target.select()"
      @keydown="$emit('keypress', $event)"
    />
  </Container>
</template>

<script>
export default {
  props: {
    value: {
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {},
  },

  data: () => ({
    localValue: '',
  }),

  watch: {
    value: {
      handler(arg) {
        this.localValue = arg
      },
      immediate: true,
    },
    localValue: {
      handler(arg) {
        this.$emit('input', arg)
      },
    },
  },

  methods: {
    focus() {
      this.$refs.main.focus()
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.textarea.main {
  resize: none;
  height: 15rem;
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
