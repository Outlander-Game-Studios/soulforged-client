<template>
  <div class="plugin-injection">
    <div v-for="plugin in plugins" :key="plugin.id">
      <component
        :is="plugin.componentNames[identifier]"
        v-bind="{ ...data, settings: pluginSettings[plugin.id] }"
      />
    </div>
  </div>
</template>

<script>
export default rxComponent({
  props: {
    identifier: null,
    data: null,
  },

  subscriptions() {
    return {
      plugins: this.$stream('identifier').switchMap((identifier) =>
        PluginService.getPluginsForSlotStream(identifier),
      ),
      pluginSettings: PluginService.getPluginSettingsStream(),
    }
  },
})
</script>
