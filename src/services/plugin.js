global.PluginService = {
  getAllPluginsStream() {
    return Rx.Observable.of(allPlugins);
  },

  getWorkingPluginsStream() {
    return PluginService.getAllPluginsStream().map((plugins) =>
      plugins
        .filter((plugin) => !!plugin.enabled)
        .filter((plugin) => !plugin.error)
    );
  },

  getDisabledPluginsStream() {
    return PluginService.getAllPluginsStream().map((plugins) =>
      plugins.filter((plugin) => !plugin.enabled || !!plugin.error)
    );
  },

  getPlayerPluginConfigStream() {
    return ControlsService.getSettingStream("plugins", {});
  },

  getPluginSettingsStream() {
    return PluginService.getPlayerPluginConfigStream();
  },

  getPlayerEnabledPluginsStream() {
    return PluginService.getPlayerPluginConfigStream().switchMap(
      (pluginConfig) => {
        console.log("pluginConfig", JSON.stringify(pluginConfig));
        return PluginService.getWorkingPluginsStream().map((plugins) =>
          plugins.filter((plugin) => pluginConfig[plugin.id]?.enabled)
        );
      }
    );
  },

  getPluginsForSlotStream(identifier) {
    return PluginService.getPlayerEnabledPluginsStream().map((plugins) =>
      plugins.filter((plugin) => plugin.componentNames[identifier])
    );
  },

  async togglePlugin(pluginId, value) {
    return PluginService.updatePluginSettings(pluginId, { enabled: value });
  },

  async updatePluginSettings(pluginId, settings) {
    const currentSettings = await ControlsService.getSetting("plugins", {});
    const updatedSettings = {
      ...currentSettings,
      [pluginId]: {
        ...(currentSettings[pluginId] || {}),
        ...settings,
      },
    };
    ControlsService.saveSetting("plugins", updatedSettings);
  },
};
