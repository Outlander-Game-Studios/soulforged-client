<template>
  <div class="top-z-index">
    <div class="top-z-index-content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.appendChild(this.$refs.content);
  },

  beforeDestroy() {
    if (this.$refs.content) {
      this.$refs.content.remove();
    }
  },
};
</script>

<style scoped lang="scss"></style>
