<template>
  <div class="star-rating" :class="{ animated: animated }">
    <div v-for="(star, idx) in stars" :key="'star_' + idx">
      <div class="star" :class="{ full: star }" :style="startStyle" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    max: {},
    size: {},
    animated: {
      default: true,
    },
    delay: {
      default: 200,
    },
  },

  data: () => ({ shownValue: 0 }),

  watch: {
    value() {
      if (this.value !== this.shownValue) {
        if (this.animated) {
          this.queueAdjustValue()
        } else {
          this.shownValue = this.value
        }
      }
    },
  },

  computed: {
    stars() {
      return Array.create(this.max).map((_, idx) => this.shownValue > idx)
    },

    startStyle() {
      if (this.size) {
        return {
          width: this.size + 'rem',
          height: this.size + 'rem',
        }
      } else {
        return {
          width: '1em',
          height: '1em',
        }
      }
    },
  },

  created() {
    if (this.animated) {
      ControlsService.setAnimationTimeout(() => {
        this.queueAdjustValue()
      }, 300)
    } else {
      this.shownValue = this.value
    }
  },

  methods: {
    queueAdjustValue() {
      ControlsService.setAnimationTimeout(() => {
        this.adjustValue()
      }, this.delay)
    },

    adjustValue() {
      if (this.value === this.shownValue) {
        return
      }
      if (this.value > this.shownValue) {
        this.shownValue += 1
      } else {
        this.shownValue -= 1
      }
      this.queueAdjustValue()
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

@keyframes fill-star {
  0% {
    transform: scale(3);
  }
  80% {
    transform: scale(1);
    filter: brightness(1.5);
  }
  100% {
    filter: brightness(1);
  }
}

.star-rating {
  display: flex;
  justify-content: space-between;

  .star {
    background-size: 100% 100%;

    &:not(.full) {
      opacity: 0.2;
      background-image: utils.ui-asset('/icons/star_empty.png');
    }

    &.full {
      background-image: utils.ui-asset('/icons/star.png');
    }
  }

  &.animated {
    .star.full {
      animation: fill-star 0.3s ease-out forwards;
    }
  }
}
</style>
