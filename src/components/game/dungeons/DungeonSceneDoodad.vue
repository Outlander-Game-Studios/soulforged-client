<template>
  <div :style="[style, animationStyle]"></div>
</template>

<script>
export default {
  props: {
    doodad: {},
  },

  data: () => ({
    currentFrame: 0,
  }),

  created() {
    const { duration = null, frames } = this.animation;
    if (duration) {
      this.animationInterval = ControlsService.setAnimationInterval(() => {
        this.currentFrame = (this.currentFrame + 1) % frames;
      }, duration * IN_MILISECONDS);
    }
  },

  beforeDestroy() {
    clearInterval(this.animationInterval);
  },

  computed: {
    animation() {
      return this.doodad.animation || {};
    },

    animationStyle() {
      const { frames } = this.animation;
      return {
        backgroundPositionX: (this.currentFrame * 100) / (frames - 1) + "%",
      };
    },

    style() {
      const { frames = 1 } = this.animation;
      const [x, y] = this.doodad.placement;
      return {
        backgroundImage: `url(${this.doodad.img})`,
        backgroundSize: `${100 * frames}% auto`,
        width: 0.2 * this.doodad.size + "%",
        marginLeft: -0.1 * this.doodad.size + "%",
        left: x + "%",
        top: y + "%",
        zIndex: Math.round(10 * this.doodad.layer),
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
