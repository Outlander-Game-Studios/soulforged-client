<template>
  <div>
    <p>
      The blue flag in the middle of the location indicates your current
      position.<br />
      You can review what can be found in this location including resources,
      creatures and structures by clicking the tab button in the
      {{ locationButtonPosition }} corner of the interface.
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({
    locationButtonPosition: "",
  }),

  created() {
    this.handleResize();
    this.handler = this.handleResize.bind(this);
    window.addEventListener("resize", this.handler);
  },

  destroyed() {
    window.removeEventListener("resize", this.handler);
  },

  methods: {
    handleResize() {
      this.locationButtonPosition = isScreenOrientationLandscape()
        ? "top-right"
        : "bottom-left";
    },
  },
};
</script>

<style scoped lang="scss"></style>
