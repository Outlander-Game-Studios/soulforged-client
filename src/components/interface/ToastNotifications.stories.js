import stoneHammerIcon from "../../../.storybook/mocks/assets/stone-hammer.png";
import bruiseIcon from "../../../.storybook/mocks/assets/bruise.png";
import hungerIcon from "../../../.storybook/mocks/assets/hunger.png";

export default {
  title: "Base UI/Toast Notifications",
};

const toastItem = {
  icon: stoneHammerIcon,
  text: "Acquired",
  subtext: "Stone Hammer (4)",
};
const toastBruise = {
  icon: bruiseIcon,
  text: "Injury",
  subtext: "Bruise (7)",
  bad: true,
};
const toastHunger = {
  icon: hungerIcon,
  text: "Improving",
  subtext: "Hungry",
  good: true,
};

export const base = () => {
  return {
    methods: {
      mockToasts() {
        ToastNotify([toastItem, toastBruise, toastHunger]);
      },
    },

    template: `
<div>
  <ToastNotifications @init="mockToasts()" />
</div>
    `,
  };
};

export const persisting = () => {
  return {
    methods: {
      mockToasts() {
        ToastNotify(
          [toastItem, toastBruise, toastHunger].map((toast) => ({
            ...toast,
            persisting: true,
          }))
        );
      },
    },

    template: `
<div>
  <ToastNotifications @init="mockToasts()" />
</div>
    `,
  };
};

export const multitude = () => {
  return {
    methods: {
      mockToasts() {
        ToastNotify([
          toastItem,
          toastBruise,
          toastHunger,
          toastItem,
          toastBruise,
          toastHunger,
          toastItem,
          toastBruise,
          toastHunger,
        ]);
      },
    },

    template: `
<div>
  <ToastNotifications @init="mockToasts()" />
</div>
    `,
  };
};

export const staggered = () => {
  return {
    methods: {
      mockToasts() {
        setTimeout(() => {
          ToastNotify(toastBruise);
        }, 1000);
        setTimeout(() => {
          ToastNotify(toastHunger);
        }, 2000);
        setTimeout(() => {
          ToastNotify(toastItem);
        }, 4000);
      },
    },

    template: `
<div>
  <ToastNotifications @init="mockToasts()" />
</div>
    `,
  };
};
staggered.parameters = {
  storyshots: { disable: true },
};
