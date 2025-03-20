<template>
  <span v-on="$listeners">
    <div class="help-button" @click="open()" :style="helpButtonStyle" />
    <Modal v-if="showInfo" dialog @close="close()" :title="title">
      <div class="help-contents">
        <slot></slot>
      </div>
    </Modal>
  </span>
</template>

<script>
import helpSound from '../../assets/sounds/help.mp3'

export default {
  props: {
    title: {
      default: null,
    },
    icon: {},
  },

  data: () => ({
    showInfo: false,
  }),

  computed: {
    helpButtonStyle() {
      return this.icon
        ? {
            backgroundImage: `url(${this.icon})`,
          }
        : {}
    },
  },

  methods: {
    open() {
      SoundService.playSound(helpSound)
      this.showInfo = true
      this.$emit('open')
    },
    close() {
      this.showInfo = false
    },
  },
}
</script>

<style lang="scss">
@use '../../utils.scss';

.help-button {
  min-width: 1em;
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: bottom;
  background-image: url(ui-asset('/icons/help.png'));
  background-size: 100% 100%;
  cursor: pointer;

  &:hover {
    @include utils.filter(brightness(1.2));
  }
}

.help-contents {
  font-style: italic;
  color: #222;

  em {
    color: black;
    font-weight: bold;
  }
}
</style>
