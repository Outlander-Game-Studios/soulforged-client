import "rxjs";
import VueRx from "vue-rx";
import Vue from "vue";
import "../common/utils/static.js";
import VueObserveVisibility from "vue-observe-visibility";
import "./dungeon-story-tools.js";

Vue.prototype.$stream = function (prop) {
  return this.$watchAsObservable(prop).pluck("newValue").startWith(this[prop]);
};

Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.use(VueRx);
VueObserveVisibility.install(Vue);

import "../src/utils.js";
import "../src/services/game.mock.js";
import "../src/services/local-storage.mock.js";
import "../src/services/chat.mock.js";
import "../src/services/controls.mock.js";
import "../src/services/sound.mock.js";
import "../src/services/plugin.mock.js";
import "../load-all.js";
import "../common/utils/array-extend.js";
import "../common/utils/uc-first.js";
import "./mocks";
import "../common/utils/math-extend.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [() => ({ template: "<story/>" })];

window.recalculateAppHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  doc.style.setProperty("--app-width", `${window.innerWidth}px`);
  doc.style.setProperty(
    "--app-min-size",
    `${Math.min(window.innerWidth, window.innerHeight)}px`
  );
};
window.addEventListener("resize", window.recalculateAppHeight);
window.recalculateAppHeight();
