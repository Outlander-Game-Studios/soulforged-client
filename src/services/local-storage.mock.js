import './local-storage.js'

LocalStorageService.mock = (object) => {
  Object.keys(object).forEach((method) => {
    LocalStorageService[method] = object[method]
  })
}

LocalStorageService.mock({
  getItem: (key, defaultValue) => defaultValue,
})
