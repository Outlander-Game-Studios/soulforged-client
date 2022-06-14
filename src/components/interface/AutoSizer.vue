<template>
  <div class="size-reference" ref="sizeReference"></div>
</template>

<script>
let fontSizeOriginal;

export default {
  data: () => ({
    fontSizeOverride: null,
  }),

  created() {
    this.handler = this.handleResize.bind(this);
    window.addEventListener("resize", this.handler);
  },

  mounted() {
    if (!fontSizeOriginal) {
      const html = document.querySelector("html");
      fontSizeOriginal = parseInt(window.getComputedStyle(html).fontSize, 10);
    }
    setTimeout(() => {
      this.handleResize();
    });
  },

  destroyed() {
    window.removeEventListener("resize", this.handler);
  },

  methods: {
    handleResize() {
      this.fontSizeOverride = this.fontSizeOverride || fontSizeOriginal;
      let newOverride;
      const referenceSize = this.$refs.sizeReference?.getBoundingClientRect()
        .width;
      if (!referenceSize) {
        return;
      }
      const targetRatio = 55;
      const screenSize = Math.min(getScreenWidth(), getScreenHeight());
      const currentRatio = screenSize / referenceSize;
      if (currentRatio !== targetRatio) {
        newOverride =
          (this.fontSizeOverride * screenSize) / referenceSize / targetRatio;
        // newOverride = Math.min(12, newOverride);
        if (newOverride !== this.fontSizeOverride) {
          this.fontSizeOverride = newOverride;
          document.querySelector("html").style.fontSize =
            this.fontSizeOverride + "px";
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.size-reference {
  width: 1rem;
  height: 1rem;
  position: fixed;
  left: -2rem;
}
</style>
