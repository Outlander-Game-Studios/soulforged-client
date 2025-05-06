<template>
  <button
    @click="handleClick($event)"
    :disabled="isDisabled"
    :class="[
      { processing: processingOn },
      { highlighted: highlighted },
      { 'no-padding': noPadding },
      'type-' + type,
    ]"
  >
    <div class="content" :class="'color-' + color">
      <div class="text">
        <slot></slot>
      </div>
    </div>
    <Spinner class="processing-spinner" v-if="processingOn" :size="3" color="white" />
  </button>
</template>

<script>
import buttonClickSound from '../../assets/sounds/button-click.mp3'

let boundComponent
window.addEventListener('keypress', ($event) => {
  if (($event.key || $event.code) === 'Enter' && boundComponent) {
    boundComponent.click($event)
  }
})

export default rxComponent({
  props: {
    processing: null,
    highlighted: false,
    disabled: false,
    type: null,
    reactToEnter: {
      type: Boolean,
    },
    noPadding: {
      type: Boolean,
    },
    color: {
      type: String,
    },
  },

  data: () => ({
    processingOn: false,
  }),

  watch: {
    processing: {
      handler(promise) {
        if (!promise) {
          this.processingOn = false
          return
        }
        this.processingOn = true
        if (typeof promise === 'boolean') {
          this.processingOn = promise
        } else {
          promise
            .then(() => {
              this.processingOn = false
            })
            .catch(() => {
              this.processingOn = false
            })
        }
      },
      immediate: true,
    },
  },

  computed: {
    isDisabled() {
      return this.disabled
    },
  },

  mounted() {
    if (this.reactToEnter) {
      if (boundComponent) {
        throw new Error('Conflicting global keypress listeners')
      }
      boundComponent = this
    }
  },

  beforeUnmount() {
    if (this.reactToEnter) {
      boundComponent = null
    }
  },

  methods: {
    handleClick($event) {
      if (!this.isDisabled) {
        SoundService.playSound(buttonClickSound)
      }
    },
  },
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@use '../../utils';

button {
  font-size: 2rem;
  @include utils.interactive();
  padding: 0;
  border: 0;
  background-color: transparent;
  outline: none;
  position: relative;

  &.highlighted {
    .content {
      box-shadow: 0 0 0.3rem 0.3rem steelblue;
      @include utils.filter(brightness(1.2) saturate(1.2));
    }
  }

  &.type-accept {
    @include utils.filter(hue-rotate(70deg));
  }
  &.type-reject {
    @include utils.filter(hue-rotate(327deg) saturate(1.5));
  }

  &.no-padding {
    .content {
      padding: 0;
    }
  }

  &[disabled] {
    pointer-events: none;
    @include utils.disabled();
  }

  &.processing {
    pointer-events: none;

    .text {
      opacity: 0.2;
    }
  }

  .content {
    position: relative;
    padding: 0.25rem 0.5rem;
    color: #eee;
    border-width: 1rem;
    border-style: solid;
    border-radius: 1rem;
    @include utils.text-outline();
    @include utils.theme-button();
  }

  .processing-spinner {
    position: absolute;
    top: 1rem;
    left: 50%;
    margin-left: -1.5rem;
  }

  &:active,
  &.active {
    .content {
      @include utils.theme-button-pressed();
    }
  }
}
</style>
