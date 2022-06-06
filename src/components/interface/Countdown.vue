<template>
  <span> {{ displayTimeRemaining }} </span>
</template>

<script>
export default {
  props: {
    seconds: {},
  },

  data: () => ({
    timeRemaining: null,
  }),

  watch: {
    seconds: {
      handler(value) {
        this.timeRemaining = value;
      },
      immediate: true,
    },
  },

  computed: {
    displayTimeRemaining() {
      const minutes = Math.floor(this.timeRemaining / 60);
      let result = minutes > 1 ? `${minutes} minutes ` : "";
      return `${result} ${this.timeRemaining % 60} seconds`;
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.timeRemaining -= 1;
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped lang="scss"></style>
