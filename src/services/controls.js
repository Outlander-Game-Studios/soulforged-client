import { Rx } from "@/rx.js";

const fullscreenOperationStream = new Rx.ReplaySubject(1);
fullscreenOperationStream.next(false);
const consideredAPStream = new Rx.ReplaySubject(1);
consideredAPStream.next(0);

const tabStream = new Rx.ReplaySubject(1);
const controlStream = new Rx.Subject();
let settingStreams;

export const ControlsService = (window.ControlsService = {
  initiateCordovaLogin() {
    const enabled =
      navigator.userAgent.includes("/Cordova") &&
      window?.webkit?.messageHandlers?.cordova_iab?.postMessage;
    if (enabled) {
      window.webkit.messageHandlers.cordova_iab.postMessage(
        JSON.stringify({ action: "login" })
      );
      return true;
    }
    return false;
  },

  cordovaLogin(profileData) {
    console.log("logging in...");
    const form = document.createElement("form");
    document.body.appendChild(form);
    form.action = `/api/login`;
    form.method = "POST";
    const input = document.createElement("input");
    form.appendChild(input);
    input.name = "accessToken";
    input.value = profileData.accessToken;
    form.submit();
  },

  isGameFocused() {
    return document.hasFocus ? document.hasFocus() : true;
  },

  toggleFullscreenOperation(setting) {
    fullscreenOperationStream.next(setting);
  },

  getFullscreenOperationStream() {
    return fullscreenOperationStream;
  },

  isStoryshots() {
    return !!(
      window.hasOwnProperty("STORYBOOK_HOOKS_CONTEXT") &&
      !window.__VUE_HOT_MAP__
    );
  },

  goToCharacterCreator() {
    window.location.hash = "/character-creator";
  },

  isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.MaxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      window.getComputedStyle(document.querySelector("html")).cursor === "none"
    );
  },

  setAnimationTimeout: (callback, delay) => {
    if (!ControlsService.isStoryshots()) {
      return setTimeout(callback, delay);
    }
  },
  setAnimationInterval: (callback, delay) => {
    if (!ControlsService.isStoryshots()) {
      return setInterval(callback, delay);
    }
  },

  getConsideredAPStream() {
    return consideredAPStream;
  },

  updateConsideredAP(value) {
    consideredAPStream.next(value === null ? Infinity : value);
  },

  triggerControlEvent(event, ...params) {
    controlStream.next({ event, params });
  },

  getControlEventStream(expectedEvent) {
    return controlStream
      .filter(({ event }) => event === expectedEvent)
      .map(({ params }) => params);
  },

  getDraggedItemStream() {
    return ControlsService.getControlEventStream("draggingItem")
      .map(([item]) => item)
      .switchMap((item) =>
        GameService.getEntityStream(item.id, ENTITY_VARIANTS.BASE, true)
      );
  },

  setCurrentOpenTab(tab) {
    tabStream.next(tab);
  },

  getCurrentOpenTabStream() {
    return tabStream;
  },

  getSettingStream(key, defaultValue) {
    if (!settingStreams) {
      settingStreams = {};
      GameService.registerHandler(
        REQUEST_CODES.SETTING_UPDATE,
        ({ settingKey, value }) => {
          if (!settingStreams[key]) {
            settingStreams[key] = new Rx.ReplaySubject(1);
          }
          settingStreams[settingKey].next(value);
        }
      );
    }
    if (!settingStreams[key]) {
      settingStreams[key] = new Rx.ReplaySubject(1);
      GameService.request(REQUEST_CODES.GET_SETTING, {
        settingKey: key,
      }).then((result) => {
        if (result?.ok === false) {
          throw new Error(`Unexpected response ${JSON.stringify(result)}`);
        } else {
          if (result === undefined) {
            result = defaultValue;
          }
          settingStreams[key].next(result);
        }
      });
    }
    return settingStreams[key];
  },

  async getSetting(key, defaultValue = undefined) {
    return await ControlsService.getSettingStream(key, defaultValue)
      .first()
      .toPromise();
  },

  saveSetting(key, value) {
    return GameService.request(REQUEST_CODES.SAVE_SETTING, {
      settingKey: key,
      value,
    }).then((result) => {
      if (result?.ok === false) {
        ToastError(result.message);
      }
    });
  },
});
