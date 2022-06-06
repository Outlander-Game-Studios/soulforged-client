const streams = {};

export const LocalStorageService = (window.LocalStorageService = {
  getItemStream(key, defaultValue) {
    if (!streams[key]) {
      streams[key] = new Rx.ReplaySubject(1);
      streams[key].next(LocalStorageService.getItem(key, defaultValue));
    }
    return streams[key];
  },

  getItem(key, defaultValue = undefined) {
    const string = localStorage.getItem(key);
    try {
      if (string !== null) {
        return JSON.parse(string);
      }
    } catch (e) {}
    return defaultValue;
  },

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    if (!streams[key]) {
      streams[key] = new Rx.ReplaySubject(1);
    }
    streams[key].next(value);
  },
});
