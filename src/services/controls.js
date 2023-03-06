import { Rx } from "@/rx.js";

const fullscreenOperationStream = new Rx.ReplaySubject(1);
fullscreenOperationStream.next(false);
const consideredAPStream = new Rx.ReplaySubject(1);
consideredAPStream.next(0);

const tabStream = new Rx.ReplaySubject(1);
const controlStream = new Rx.Subject();
let settingStreams;
let draggedItemStream;

export const ControlsService = (window.ControlsService = {
  cordovaLoginAvailable() {
    return (
      navigator.userAgent.includes("/Cordova") &&
      navigator.userAgent.includes("/IntegratedLogin") &&
      window?.webkit?.messageHandlers?.cordova_iab?.postMessage
    );
  },

  initiateCordovaLogin() {
    window.webkit.messageHandlers.cordova_iab.postMessage(
      JSON.stringify({ action: "login" })
    );
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

  cordovaOpenNativeBrowserAvailable() {
    return (
      navigator.userAgent.includes("/Cordova") &&
      navigator.userAgent.includes("/OpenBrowser") &&
      window?.webkit?.messageHandlers?.cordova_iab?.postMessage
    );
  },

  openNewWindow(url) {
    if (ControlsService.cordovaOpenNativeBrowserAvailable()) {
      window.webkit.messageHandlers.cordova_iab.postMessage(
        JSON.stringify({ action: "openNativeBrowser", url })
      );
    } else {
      window.open(url, "_blank");
    }
  },

  electronLoginAvailable() {
    return window.SoulforgedElectron?.initLogin;
  },

  initiateElectronLogin() {
    const token = [
      `electron-login`,
      `${md5(`${Math.random()}`)}`,
      `${md5(`${new Date()}`)}`,
      `${md5(`${navigator.userAgent}`)}`,
    ].join("-");
    SoulforgedElectron.initLogin(token);
    window.location = `#/login/electron?token=${token}`;
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
    if (!window.location.hash?.includes("/login")) {
      window.location.hash = "/character-creator";
    }
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
    if (!draggedItemStream) {
      draggedItemStream = ControlsService.getControlEventStream("draggingItem")
        .map(([item]) => item)
        .switchMap((item) =>
          GameService.getEntityStream(item.id, ENTITY_VARIANTS.BASE, true)
        )
        .shareReplay(1);
    }
    return draggedItemStream;
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
        throw new Error(result.message);
      }
    });
  },
});
