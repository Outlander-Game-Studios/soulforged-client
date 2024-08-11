import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "rxjs";
import VueRx from "vue-rx";

import "./utils.js";
import "@/../common/utils/index.js";
import "@/services/game.js";
import "@/services/sound.js";
import "@/services/chat.js";
import "@/services/controls.js";
import "@/services/plugin.js";
import "@/../load-all.js";
import VueObserveVisibility from "vue-observe-visibility";

try {
  Vue.config.productionTip = false;
  Vue.config.devtools = false;
  Vue.use(VueRx);
  VueObserveVisibility.install(Vue);

  Vue.prototype.$stream = function (prop) {
    return this.$watchAsObservable(prop)
      .pluck("newValue")
      .startWith(this[prop]);
  };

  new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");

  const lastSizing = {};
  window.recalculateAppHeight = () => {
    const width = getScreenWidth();
    const height = getScreenHeight();
    if (lastSizing.width !== width || lastSizing.height !== height) {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${height}px`);
      doc.style.setProperty("--app-width", `${width}px`);
      doc.style.setProperty("--app-min-size", `${Math.min(width, height)}px`);
      lastSizing.width = width;
      lastSizing.height = height;
    }
  };
  window.addEventListener("resize", () => {
    window.recalculateAppHeight();
    setTimeout(window.recalculateAppHeight, 100);
    setTimeout(window.recalculateAppHeight, 200);
  });
  window.recalculateAppHeight();

  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Generic JS error.");
    GameService.reportClientSideError({
      message: error.toString(),
      stack: error.stack,
    });
  };

  Vue.config.warnHandler = Vue.config.errorHandler = (error, vm, info) => {
    console.error(
      "Error in component:",
      vm.$vnode && vm.$vnode.tag,
      `(${info})`
    );
    console.error(error);
    const component = vm.$vnode && vm.$vnode.tag;
    GameService.reportClientSideError({
      message: `Vue Error:\n${error.toString()}\n in component ${component}`,
      stack: info,
    });
  };

  (function () {
    if (window.document.documentMode) {
      // IE
      window.location = "static/unsupported";
    }
  })();
  document.getElementById("criticalFailure").remove();
} catch (e) {
  document.getElementById("criticalFailure").innerText =
    e.message + "\n" + e.stack;
  throw e;
}
