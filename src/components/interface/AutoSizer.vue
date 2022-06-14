<template>
  <div class="size-reference" ref="sizeReference"></div>
</template>

<script>
let fontSizeOriginal;
let fontSizeOverride;

export default {
  data: () => ({}),

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
      fontSizeOverride = fontSizeOverride || fontSizeOriginal;
      let newOverride;
      const referenceSize = this.$refs.sizeReference?.getBoundingClientRect()
        .width;
      if (!referenceSize) {
        return;
      }
      const targetRatio = 55;
      const [width, height] = [getScreenWidth(), getScreenHeight()];
      const screenSize =
        width > height
          ? Math.min(width * 0.66, height)
          : Math.min(width, height * 0.66);
      const currentRatio = screenSize / referenceSize;
      if (currentRatio !== targetRatio) {
        newOverride =
          (fontSizeOverride * screenSize) / referenceSize / targetRatio;
        if (newOverride > 12) {
          newOverride = newOverride * 0.625;
        }
        if (newOverride !== fontSizeOverride) {
          fontSizeOverride = newOverride;
          document.querySelector("html").style.fontSize =
            fontSizeOverride + "px";
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
