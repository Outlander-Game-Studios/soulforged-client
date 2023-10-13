import "./plugin.js";

PluginService.mock = (object) => {
  Object.keys(object).forEach((method) => {
    PluginService[method] = object[method];
  });
};

const stream = new Rx.ReplaySubject(1);
PluginService.mock({
  getPlayerPluginConfigStream: () => {
    return stream;
  },
  mockUpdateSettingStream: (update) => {
    stream.next(update);
  },
});
