import "rxjs";
import VueRx from "vue-rx";
import Vue from "vue";
import "../common/utils/static.js";
import VueObserveVisibility from "vue-observe-visibility";

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
import "../src/components/.index.js";
import "../common/utils/array-extend.js";
import "../common/utils/uc-first.js";
import "./mocks";
import "../common/utils/math-extend.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

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
