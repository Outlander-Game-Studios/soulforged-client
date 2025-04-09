global.PropValidator = {
  oneOf(array) {
    return (value) => {
      if (!array.includes(value)) {
        console.error(
          `Failed prop validation, value must be one of ${JSON.stringify(array)}, was ${value}`,
        )
        return false
      }
      return true
    }
  },
}

global.bubbleEvents = ($attrs, events) => {
  return events
    .filter((e) => !!$attrs[e])
    .toObject(
      (e) => e,
      (e) => $attrs[e],
    )
}

window.getScreenWidth = () =>
  Math.min(
    ControlsService.isTouchDevice() ? window.outerWidth : Infinity,
    window.innerWidth,
    document.documentElement ? document.documentElement.clientWidth : Infinity,
  )
window.getScreenHeight = () =>
  Math.min(
    ControlsService.isTouchDevice() ? window.outerHeight : Infinity,
    window.innerHeight,
    document.documentElement ? document.documentElement.clientHeight : Infinity,
  )

global.isScreenOrientationLandscape = () => {
  const screenWidth = getScreenWidth()
  const screenHeight = getScreenHeight()

  return screenWidth > screenHeight
}
global.getScreenOrientation = () => (isScreenOrientationLandscape() ? 'landscape' : 'portrait')

global.creaturesSort = (a, b) => {
  if (!!a.hostile !== !!b.hostile) {
    return a.hostile ? 1 : -1
  }
  if (!!a.inactive !== !!b.inactive) {
    return a.inactive ? 1 : -1
  }
  if (!!a.nonAggressive !== !!b.nonAggressive) {
    return a.nonAggressive ? 1 : -1
  }
  if (a.name !== b.name) {
    return GameService.stripRichText(a.name) > GameService.stripRichText(b.name) ? 1 : -1
  }
  return 0
}

global.structureSorter = (a, b) => {
  if (!!a.ruin !== !!b.ruin) {
    return a.ruin ? 1 : -1
  }
  if (!!a.own !== !!b.own) {
    return b.own ? 1 : -1
  }
  if (b.operational !== a.operational) {
    return b.operational ? 1 : -1
  }
  if (b.order !== a.order) {
    return a.order > b.order ? 1 : -1
  }
  return +a.condition - +b.condition
}
