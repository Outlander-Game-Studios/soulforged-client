import DeathView from "./DeathView.vue";
import { Rx } from "@/rx.js";

export default {
  title: "Game UI/Death Screen",
};

export const base = mockComponent({
  components: {
    DeathView,
  },

  template: "<DeathView />",
});

export const withNotifications = mockComponent({
  components: {
    DeathView,
  },

  mounted() {
    ToastNotify({
      text: "Notification",
      persisting: true,
    });
  },

  template: `
<div>
  <DeathView />
  <ToastNotifications />
</div>`,
});
