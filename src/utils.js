global.PropValidator = {
  oneOf(array) {
    return (value) => {
      if (!array.includes(value)) {
        console.error(
          `Failed prop validation, value must be one of ${JSON.stringify(
            array
          )}, was ${value}`
        );
        return false;
      }
      return true;
    };
  },
};

global.bubbleEvents = ($listeners, events) => {
  return events
    .filter((e) => !!$listeners[e])
    .toObject(
      (e) => e,
      (e) => $listeners[e]
    );
};

window.getScreenWidth = () =>
  Math.min(
    ControlsService.isTouchDevice() ? window.outerWidth : Infinity,
    window.innerWidth,
    document.documentElement ? document.documentElement.clientWidth : Infinity
  );
window.getScreenHeight = () =>
  Math.min(
    ControlsService.isTouchDevice() ? window.outerHeight : Infinity,
    window.innerHeight,
    document.documentElement ? document.documentElement.clientHeight : Infinity
  );

global.isScreenOrientationLandscape = () => {
  const screenWidth = getScreenWidth();
  const screenHeight = getScreenHeight();

  return screenWidth > screenHeight;
};
global.getScreenOrientation = () =>
  isScreenOrientationLandscape() ? "landscape" : "portrait";

global.creaturesSort = (a, b) => {
  if (a.hostile !== b.hostile) {
    return a.hostile ? 1 : -1;
  }
  if (a.inactive !== b.inactive) {
    return a.inactive ? 1 : -1;
  }
  if (a.name !== b.name) {
    return a.name > b.name ? 1 : -1;
  }
  return 0;
};

global.structureSorter = (a, b) => {
  if (!!a.own !== !!b.own) {
    return b.own ? 1 : -1;
  }
  if (b.operational !== a.operational) {
    return b.operational ? 1 : -1;
  }
  if (b.order !== a.order) {
    return a.order > b.order ? 1 : -1;
  }
  return +a.condition - +b.condition;
};

global.itemSorter = (a, b) => {
  if (a.isRuined !== b.isRuined) {
    return a.isRuined ? 1 : -1;
  }
  if (a.category !== b.category) {
    return (a.category || Infinity) > (b.category || Infinity) ? 1 : -1;
  }
  if (a.name !== b.name) {
    return a.name > b.name ? 1 : -1;
  }
  if (b.quality !== a.quality) {
    return b.quality - a.quality;
  }
  return +a.durabilityStage - +b.durabilityStage;
};
