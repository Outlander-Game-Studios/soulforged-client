<template>
  <div class="wrapper" @click="$emit('click', $event)">
    <div>
      <Container
        :borderSize="borderSize"
        backgroundType="alt"
        class="container"
        :left="left"
        :style="containerStyle"
      >
        <div class="container-inner" :style="containerInnerStyle">
          <template v-if="current !== undefined">
            <div class="fill-wrapper" :style="getFillWrapperStyle(current)">
              <div class="fill" :class="color" :style="getFillStyle(current)" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, idx) in fillItems"
              :key="idx"
              class="fill-wrapper"
              :style="item.wrapperStyle"
            >
              <div class="fill" :class="item.color" :style="item.style"></div>
            </div>
          </template>
          <div class="text">
            <slot />
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fills: {},
    current: {},
    color: {
      default: 'blue',
    },
    max: {
      default: 100,
    },
    size: {
      default: 3.5,
    },
    left: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    containerStyle() {
      return {
        height: this.size + 'rem',
      }
    },
    containerInnerStyle() {
      return {
        height: (this.size * 5) / 7 + 'rem',
      }
    },

    borderSize() {
      return this.size / 7
    },

    fillItems() {
      let offset = 0
      let spaceLeft = 1
      return Object.keys(this.fills || {}).map((color) => {
        const style = this.getFillStyle(this.fills[color], offset, spaceLeft)
        const wrapperStyle = this.getFillWrapperStyle(this.fills[color], offset, spaceLeft)
        offset += style.value
        spaceLeft -= style.value
        return {
          color,
          style,
          wrapperStyle,
        }
      })
    },
  },

  methods: {
    getFillWrapperStyle(value, offset = 0, spaceLeft = 1) {
      const size = Math.min(value / this.max, spaceLeft, 1)
      return {
        width: 100 * size + '%',
      }
    },

    getFillStyle(value, offset = 0, spaceLeft = 1) {
      const size = Math.min(value / this.max, spaceLeft, 1)
      return {
        value: size,
        width: 100 / size + '%',
        left: (-100 * offset) / size + '%',
        'border-width': `${this.size / 7}rem`,
        'border-radius': `${this.size / 6}rem`,
      }
    },
  },
}
</script>

<style scoped lang="scss">
@use '../../utils.scss';

.container {
  overflow: visible;
}

.container-inner {
  width: 100%;
  overflow: visible;
  display: flex;
  position: relative;

  .fill-wrapper {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .fill {
    height: 100%;
    position: absolute;

    &.green {
      background-color: forestgreen;
    }
    &.yellow {
      background-color: yellow;
    }
    &.orange {
      background-color: darkorange;
    }
    &.red {
      background-color: firebrick;
    }
    &.blue {
      background-color: cornflowerblue;
    }
    &.cyan {
      background-color: cyan;
    }

    @include utils.theme-progress-bar-fill();
  }

  .text {
    font-size: 2rem;
    position: absolute;
    left: 0;
    right: 0;
  }
}
</style>
