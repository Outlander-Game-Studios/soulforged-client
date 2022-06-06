<template>
  <div>
    <HorizontalFill class="select-component">
      <Button @click="selecting = true">{{ currentLabel }}</Button>
    </HorizontalFill>
    <Modal v-if="selecting" dialog @close="selecting = false">
      <Vertical>
        <Button
          v-for="(label, value) in options"
          :key="value"
          @click="
            $emit('input', value);
            selecting = false;
          "
        >
          {{ label }}
        </Button>
      </Vertical>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
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
          this.$emit("input", Object.keys(this.options).shift());
        }
      },
      immediate: true,
    },
  },

  computed: {
    currentLabel() {
      return this.options[this.value];
    },
  },
};
</script>

<style scoped lang="scss">
.select-component {
}
</style>
