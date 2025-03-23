<template>
  <div class="option-selector">
    <div class="prev">
      <Button :disabled="!cycle && isFirst" @click="prev()">&lt;</Button>
    </div>
    <div class="label">{{ label }}</div>
    <div class="next">
      <Button :disabled="!cycle && isLast" @click="next()">&gt;</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {},
    options: {},
    value: {},
    cycle: {
      type: Boolean,
    },
    random: {
      type: Boolean,
    },
  },

  computed: {
    internalOptions() {
      if (!Array.isArray(this.options)) {
        return Array.create(this.options)
      }
      return this.options
    },

    internalOptionsCount() {
      return this.internalOptions.length
    },
    isFirst() {
      return this.value === this.internalOptions[0]
    },
    isLast() {
      return this.value === this.internalOptions[this.internalOptionsCount - 1]
    },
  },

  watch: {
    options: {
      handler() {
        if (this.random) {
          this.selectRandom()
        }
      },
      immediate: true,
    },
  },

  methods: {
    selectRandom() {
      this.$emit(
        'update:value',
        this.internalOptions[Math.floor(Math.random() * this.internalOptionsCount)],
      )
    },

    prev() {
      const idx = this.internalOptions.indexOf(this.value)
      this.$emit(
        'update:value',
        this.internalOptions[(idx + this.internalOptionsCount - 1) % this.internalOptionsCount],
      )
    },

    next() {
      const idx = this.internalOptions.indexOf(this.value)
      this.$emit(
        'update:value',
        this.internalOptions[(idx + this.internalOptionsCount + 1) % this.internalOptionsCount],
      )
    },
  },
}
</script>

<style scoped lang="scss">
.option-selector {
  display: flex;
  flex-direction: row;

  .label {
    padding: 0 2rem;
    flex-grow: 1;
    line-height: 3rem;
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
