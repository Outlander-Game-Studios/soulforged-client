<template>
  <div
    class="main-container"
    :class="{ flexible: flexible, 'lazy-load': lazyLoad }"
    v-observe-visibility="onVisibilityChange"
  >
    <!-- TODO: v-observe-visibility not working -->
    <div v-if="(lazyLoad && !loadedData) || (!visible && !flexible)" class="flex-grow">
      <LoadingPlaceholder :size="6" />
    </div>
    <div v-else class="info" :class="{ interactive: hasClick }" @click="$emit('click', $event)">
      <div class="icon">
        <slot v-if="!!$slots.icon || !!$scopedSlots.icon" name="icon" :lazyData="loadedData" />
        <Icon v-else :src="iconSrc" :size="iconSize" :text="text" />
      </div>
      <div class="details">
        <div class="title" :class="titleClass">
          <slot name="title" :lazyData="loadedData" />
        </div>
        <div class="subtitle" :class="subtitleClass">
          <slot name="subtitle" :lazyData="loadedData" />
        </div>
      </div>
    </div>
    <div class="buttons">
      <slot name="buttons" :lazyData="loadedData" />
    </div>
  </div>
</template>

<script>
export default rxComponent({
  props: {
    subtitleClass: {},
    titleClass: {},
    iconSrc: {},
    text: {},
    lazyLoad: {},
    flexible: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      default: 6,
    },
  },

  data: () => ({
    visible: false,
  }),

  subscriptions() {
    return {
      loadedData: this.$stream('visible')
        .filter((visible) => !!visible)
        .distinctUntilChanged()
        .switchMap(() => this.$stream('lazyLoad'))
        .filter((visible) => !!visible)
        .switchMap((fn) => (typeof fn === 'function' ? fn() : Rx.Observable.of(true))),
    }
  },

  computed: {
    hasClick() {
      return !!this.$attrs.onClick
    },
  },

  methods: {
    onVisibilityChange(isVisible) {
      this.visible = isVisible
    },
  },
})
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  max-width: 100%;

  &.lazy-load {
    height: 6rem;
  }

  .info {
    display: flex;
    flex-grow: 1;
  }

  .details {
    padding-left: 0.4rem;
    margin-left: 0.6rem;
    margin-right: 1rem;
    flex-grow: 1;
    overflow: hidden;

    .title {
      font-size: 2rem;
      font-style: italic;

      em {
        font-weight: bold;
      }
    }

    .subtitle {
      font-size: 1.5rem;
    }
  }

  &.flexible {
    flex-grow: 1;

    .title,
    .subtitle {
      &:not(.wrap) {
        white-space: nowrap;
      }
    }
  }

  &:not(.flexible) {
    .title,
    .subtitle {
      &:not(.wrap) {
        width: 0;
        white-space: nowrap;
      }
    }
  }
}
</style>
