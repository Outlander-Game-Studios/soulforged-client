<template>
  <div class="loading-placeholder" :style="style">
    <Spinner color="#964500" :size="size / 2" />
  </div>
</template>

<script>
export default {
  props: {
    size: {
      default: 12,
    },
  },

  computed: {
    style() {
      return {
        padding: `${this.size / 4}rem`,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.loading-placeholder {
  display: flex;
  justify-content: center;
}
</style>
