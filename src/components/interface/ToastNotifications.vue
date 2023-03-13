<template>
  <div class="toast-wrapper" :class="{ offset: offset }">
    <div
      v-for="toast in toasts"
      :key="toast.toastId"
      class="list-item-wrapper"
      :class="{ removing: toast.removing, good: toast.good, bad: toast.bad }"
    >
      <div
        class="list-item-inner-wrapper"
        @click="removingToast(toast.toastId)"
      >
        <CloseButton v-if="toast.persisting" :size="2"></CloseButton>
        <Container
          class="notification-container"
          :borderSize="1"
          borderType="alt"
        >
          <ListItem flexible class="notification-list-item">
            <template v-slot:icon>
              <Icon class="notification-icon" :src="toast.icon" :size="5" />
            </template>
            <template v-slot:title>
              <div class="toast-title">
                <RichText :value="toast.text" nonInteractive />
              </div>
            </template>
            <template v-slot:subtitle>
              <div class="sub-text">
                <RichText :value="toast.subtext" nonInteractive />
              </div>
            </template>
          </ListItem>
        </Container>
      </div>
    </div>
    <div
      v-if="toasts.length"
      class="list-item-wrapper removal-all"
      :class="{ removing: !someValid }"
    >
      <div class="list-item-inner-wrapper" @click="removingAllToasts()">
        <Container
          class="notification-container"
          :borderSize="1"
          borderType="alt"
        >
          <Horizontal tight>
            <div class="remove-all-label">Dismiss All</div>
            <CloseButton :size="5" static />
          </Horizontal>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>
import exclamationIcon from "../../assets/ui/cartoon/icons/exclamation.png";
import okIcon from "../../assets/ui/cartoon/icons/tick_green.jpg";
import CloseButton from "./CloseButton";
import HorizontalFill from "../layouts/HorizontalFill";

const toastStream = new Rx.Subject();
let toastId = 0;

export default {
  components: { HorizontalFill, CloseButton },
  props: {
    hideDelay: {
      default: 6000,
    },
  },

  data: () => ({
    toasts: [],
    someValid: false,
  }),

  subscriptions() {
    return {
      offset: ControlsService.getControlEventStream("notificationOffset").map(
        ([offset]) => offset
      ),
      toastsFeed: toastStream.tap((toast) => {
        this.addToast(toast);
      }),
    };
  },

  mounted() {
    this.$emit("init");
    GameService.registerHandler(REQUEST_CODES.TOAST, (toast) =>
      ToastNotify(toast)
    );
  },

  methods: {
    addToast(toast) {
      this.someValid = true;
      toastId++;
      this.toasts.unshift({
        ...toast,
        removing: false,
        toastId: toastId,
      });
      if (!toast.persisting) {
        this.queueRemovingToast(toastId);
      }
    },

    queueRemovingToast(toastId) {
      setTimeout(() => {
        this.removingToast(toastId);
      }, this.hideDelay);
    },

    removingAllToasts() {
      this.toasts.forEach((toast) => this.removingToast(toast.toastId));
    },

    removingToast(toastId) {
      const toast = this.toasts.find((toast) => toast.toastId === toastId);
      if (!toast || toast.removing) {
        return;
      }
      toast.removing = true;
      setTimeout(() => {
        this.removeToast(toastId);
      }, 2500);

      this.someValid = this.toasts.some((toast) => !toast.removing);
    },

    removeToast(toastId) {
      this.toasts = this.toasts.filter((toast) => toast.toastId !== toastId);
    },
  },
};

const ToastNotify = (toasts) => {
  if (!toasts) {
    return;
  }
  if (!Array.isArray(toasts)) {
    toasts = [toasts];
  }
  toasts.forEach((toast) => toastStream.next(toast));
};
const ToastError = (message) => {
  ToastNotify({
    icon: exclamationIcon,
    text: message || "Unexpected error",
  });
};
const ToastSuccess = (message, subtext) => {
  ToastNotify({
    icon: okIcon,
    text: message || "Success",
    subtext,
  });
};
window.ToastNotify = ToastNotify;
window.ToastError = ToastError;
window.ToastSuccess = ToastSuccess;
export { ToastNotify, ToastError };
</script>

<style scoped lang="scss">
@import "../../utils.scss";

$height: 7rem;

$shiftOut: 50rem;

@keyframes toast-removing {
  0% {
    max-height: $height;
    margin-bottom: 1rem;
    right: 0;
  }
  70% {
    max-height: $height;
    margin-bottom: 1rem;
    right: -$shiftOut;
  }
  80% {
    margin-bottom: 0;
  }
  100% {
    max-height: 0;
    margin-bottom: 0;
    right: -$shiftOut;
  }
}
@keyframes toast-appearing {
  0% {
    max-height: 0;
    margin-bottom: 0;
    opacity: 0;
    pointer-events: none;
  }
  70% {
    max-height: $height;
    margin-bottom: 1rem;
    opacity: 1;
    pointer-events: none;
  }
  100% {
    max-height: $height;
    margin-bottom: 1rem;
    pointer-events: all;
  }
}

.toast-wrapper {
  width: 0;
  pointer-events: none;
  overflow: visible;
  z-index: 99000;
  position: fixed;
  bottom: 1rem;
  right: 1rem;

  &.offset {
    bottom: 22rem;
  }
}

.list-item-wrapper {
  display: flex;
  pointer-events: none;
  justify-content: flex-end;
  margin-bottom: 1rem;
  animation: ease-out 0.5s toast-appearing 1;
  animation-fill-mode: forwards;
  box-shadow: 0.75rem 0.75rem 0.75rem black;
  background: black;
  border-radius: 0.7rem;
  clear: both;
  float: right;
  position: relative;

  &.removing {
    position: relative;
    animation: ease-in-out 0.7s toast-removing 1;
    animation-fill-mode: forwards;
  }
  &.good .main-container {
    background: rgba(50, 205, 50, 0.5);
  }
  &.bad .main-container {
    background: rgba(252, 42, 42, 0.4);
  }

  .list-item-inner-wrapper {
    @include interactive();
    min-height: $height;
  }

  &.removal-all {
    .list-item-inner-wrapper {
      min-height: auto;
    }
  }
}
.toast-title {
  padding: 0.25rem 0 0;
}

.toast-title,
.sub-text {
  white-space: nowrap;
}

.notification-container,
.notification-list-item {
  overflow: hidden;
}

.remove-all-label {
  white-space: nowrap;
  padding: 1.4rem 2rem;
}
</style>
