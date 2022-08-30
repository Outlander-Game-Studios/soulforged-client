<template>
  <transition name="modal">
    <span class="modal-container">
      <div
        class="modal-wrapper"
        :class="{ dialog: dialog, large: large, specialFrame: specialFrame }"
        ref="modalWrapper"
      >
        <div class="modal">
          <Container borderType="alt" :borderSize="1.6">
            <CloseButton
              v-if="$listeners.close"
              class="close"
              @click="$emit('close')"
            />
            <div v-if="$slots.title || title" class="title-wrapper">
              <Header class="title-container" :alt3="specialFrame">
                <div class="title-contents">
                  {{ title }}
                  <slot name="title"></slot>
                </div>
              </Header>
            </div>
            <div class="contents">
              <Spaced>
                <slot v-if="!$slots.default" name="contents"></slot>
                <slot v-else />
              </Spaced>
            </div>
          </Container>
        </div>
        <div class="backdrop" @click="backdropMouseClick()"></div>
      </div>
    </span>
  </transition>
</template>

<script>
import Container from "../layouts/Container";
import closeSound from "../../assets/sounds/close.ogg";

export default {
  components: { Container },
  props: {
    closeable: {
      type: Boolean,
      default: true,
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    specialFrame: {
      type: Boolean,
      default: false,
    },
    title: {},
    attachToBody: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    headerSideStyle: "",
  }),

  mounted() {
    if (this.attachToBody) {
      document.body.appendChild(this.$refs.modalWrapper);
    }
  },

  beforeDestroy() {
    if (this.$refs.modalWrapper) {
      this.$refs.modalWrapper.remove();
    }
  },

  methods: {
    backdropMouseClick() {
      if (!!this.$listeners.close) {
        SoundService.playSound(closeSound, { speed: 2 });
        this.$emit("close");
      } else {
        // TODO: add error sound
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../utils.scss";

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes pop-in {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  80% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-wrapper {
  $animation-duration: 0.12s;
  position: fixed;
  bottom: 3rem;
  left: 3rem;
  right: 3rem;
  top: 10rem;
  z-index: 9000;
  display: flex;
  flex-direction: column;

  .backdrop {
    @include fill();
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9001;
    animation: fade-in $animation-duration ease-out forwards;
  }

  .modal {
    animation: pop-in $animation-duration ease-out forwards;
    position: absolute;
    bottom: 0;
    max-height: 100%;
    width: 100%;
    z-index: 9002;
    display: flex;
    flex-direction: column;
  }

  .title-wrapper {
    font-size: 1.25rem;
    line-height: 1.5rem;
    text-align: center;
    display: flex;
    position: absolute;
    left: 20%;
    right: 20%;
    bottom: calc(100% - 1.5rem);
    z-index: 2;
    pointer-events: none;

    .title-container {
      box-sizing: border-box;
      max-width: 100%;
      margin: 0 auto;
      line-height: 1;
      pointer-events: all;

      .title-contents {
        padding: 0.25rem;
      }
    }
  }

  &.specialFrame {
    .modal {
      .border-container {
        &::before {
          content: "";
          @include fill();
          pointer-events: none;
          border-width: 10rem;
          border-style: solid;
          border-image: url(ui-asset("/borders/mid_bar_frame_single.png")) 200;
          background-size: 100% 100%;
        }
      }
    }
  }

  &.dialog {
    left: 3rem;
    right: 3rem;
    justify-content: space-around;

    &.large {
      .modal {
        min-width: calc(0.85 * var(--app-min-size));
      }
    }

    .modal {
      position: relative;
      bottom: initial;
      width: auto;
      max-width: 85%;
      margin: 0 auto;
    }
  }
}
</style>
