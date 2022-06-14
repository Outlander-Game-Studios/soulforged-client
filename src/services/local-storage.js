const streams = {};

export const LocalStorageService = (window.LocalStorageService = {
  getItemStream(key, defaultValue) {
    if (!streams[key]) {
      streams[key] = new Rx.ReplaySubject(1);
      const initial = LocalStorageService.getItem(key, defaultValue);
      if (initial !== undefined) {
        streams[key].next(initial);
      }
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

  isImageCached(src) {
    const image = new Image();
    image.src = src;
    const cached = image.complete;
    image.remove();
    return cached;
  },
});
