<template>
  <span>{{ symbol }}{{ value }}</span>
</template>

<script>
export default {
  props: {
    value: {},
  },

  computed: {
    symbol() {
      return this.value > 0 ? "+" : "";
    },
  },
};
</script>
