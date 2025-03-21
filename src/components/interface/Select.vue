<template>
  <div>
    <HorizontalFill v-if="!label" class="select-component">
      <Button @click="selecting = true">
        <slot name="option" :label="currentLabel">
          {{ currentLabel }}
        </slot>
      </Button>
    </HorizontalFill>
    <HorizontalFill v-else>
      <LabeledValue :label="label">
        <Button @click="selecting = true">
          <slot name="option" :label="currentLabel">
            {{ currentLabel }}
          </slot>
        </Button>
      </LabeledValue>
    </HorizontalFill>
    <Modal v-if="selecting" dialog @close="selecting = false">
      <Vertical>
        <Button v-for="(label, value) in options" :key="value" @click="onClick(value)">
          <slot name="option" :label="label">
            {{ label }}
          </slot>
        </Button>
      </Vertical>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    label: {},
    options: {
      default: () => ({}),
    },
    value: {},
  },

  data: () => ({
    selecting: false,
  }),

  watch: {
    options: {
      handler() {
        if (!this.options[this.value]) {
          this.$emit('input', Object.keys(this.options).shift())
        }
      },
      immediate: true,
    },
  },

  computed: {
    currentLabel() {
      return this.options[this.value]
    },
  },

  methods: {
    onClick(value) {
      this.$emit('update:value', value)
      this.selecting = false
    },
  },
}
</script>

<style scoped lang="scss">
.select-component {
}
</style>
