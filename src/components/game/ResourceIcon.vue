<template>
  <Icon
    @click="mouseClick()"
    :src="resource.icon"
    :backgroundType="resource.fight ? 'danger-low' : 'alt2'"
    :size="size"
  >
    <IndicatorResourceDensity class="density" :density="resource.density" />
  </Icon>
</template>

<script>
import iconClickSound from "../../assets/sounds/icon-click.mp3";

export default {
  props: {
    resource: {},
    size: {
      default: 5,
    },
  },

  data: () => ({}),

  methods: {
    mouseClick() {
      if (!!this.$listeners.click) {
        this.$emit("click");
        SoundService.playSound(iconClickSound);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

.density {
  position: absolute !important;
  font-size: 1.5rem;
  top: 2%;
  right: 2%;
}
</style>
