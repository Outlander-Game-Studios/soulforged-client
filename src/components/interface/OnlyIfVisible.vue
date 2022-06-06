<template>
  <div v-observe-visibility="onVisibilityChange">
    <div v-if="visible">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    visible: false,
  }),
  methods: {
    onVisibilityChange(isVisible) {
      this.visible = isVisible;
    },
  },
};
</script>

<style></style>
