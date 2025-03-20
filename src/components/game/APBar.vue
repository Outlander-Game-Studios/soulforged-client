<template>
  <ProgressBar :fills="fills" :left="leftBorder" :size="size">
    <div class="text-display" v-if="!hideText">
      <div class="current">{{ AP }}</div>
      <div class="flex-grow"></div>
      <div class="considered" v-if="consideredAP">
        {{ consideredAP === Infinity ? 'Impossible' : '-' + consideredAP }}
      </div>
    </div>
  </ProgressBar>
</template>

<script>
export default {
  props: {
    leftBorder: true,
    AP: false,
    maxAP: false,
    consideredAP: null,
    size: {
      default: 3.5,
    },
    hideText: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    fills() {
      const currentRatio = (this.AP / this.maxAP) * 100
      const consideredRatio = (this.consideredAP / this.maxAP) * 100
      if (currentRatio < consideredRatio) {
        return {
          orange: currentRatio,
          red: consideredRatio - currentRatio,
        }
      }
      return {
        darkBlue: currentRatio - consideredRatio,
        blue: consideredRatio,
      }
    },
  },

  mounted() {},

  beforeDestroy() {},

  methods: {},
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.text-display {
  display: flex;
  margin: 0.3rem 0.6rem 0;
  justify-content: flex-start;
  @include utils.text-outline();

  .current,
  .considered {
    font-size: 85%;
  }
}
</style>
