<template>
  <Vertical>
    <Header>Available plugins</Header>
    <LoadingPlaceholder v-if="!pluginsEnabled" />
    <Container v-else v-for="plugin in workingPlugins">
      <Spaced>
        <Horizontal>
          <div class="flex-grow">
            <div class="name">{{ plugin.name }}</div>
            <div class="author">by {{ plugin.author }}</div>
          </div>
          <Button
            v-if="plugin.settings.length && true"
            @click="toggleConfig(plugin)"
          >
            {{ showSettings[plugin.id] ? "Hide" : "Show" }} Config
          </Button>
          <Checkbox
            :value="pluginsEnabled.some((p) => p.id === plugin.id)"
            @input="togglePlugin(plugin.id, $event)"
          />
        </Horizontal>
      </Spaced>
      <Spaced v-if="showSettings[plugin.id]">
        <Vertical>
          <div v-for="(setting, idx) in plugin.settings" :key="idx">
            <label>{{ setting.name }}</label>
            <Input v-model="settingsValues[plugin.id][setting.id]" />
          </div>
          <HorizontalCenter>
            <Button @click="saveSettings(plugin)">Save</Button>
          </HorizontalCenter>
        </Vertical>
      </Spaced>
    </Container>
    <span v-if="!workingPlugins.length" class="text-none">None</span>
    <template v-if="disabledPlugins.length">
      <Collapsible startCollapsed>
        <template v-slot:header> Disabled plugins </template>
        <template v-slot:content>
          <Vertical>
            <Container v-for="plugin in disabledPlugins">
              <Spaced>
                <Horizontal>
                  <div class="flex-grow">
                    <div class="name">{{ plugin.name }}</div>
                    <div class="author">by {{ plugin.author }}</div>
                  </div>
                  <div>Reason: {{ plugin.error ? "Error" : "Disabled" }}</div>
                </Horizontal>
              </Spaced>
            </Container>
          </Vertical>
        </template>
      </Collapsible>
    </template>
  </Vertical>
</template>

<script>
import Vertical from "../layouts/Vertical";
import HorizontalCenter from "../layouts/HorizontalCenter";
import LoadingPlaceholder from "../interface/LoadingPlaceholder";
export default {
  components: { LoadingPlaceholder, HorizontalCenter, Vertical },
  data: () => ({
    showSettings: {},
    settingsValues: {},
  }),

  subscriptions() {
    return {
      pluginsEnabled: PluginService.getPlayerEnabledPluginsStream(),
      workingPlugins: PluginService.getWorkingPluginsStream(),
      disabledPlugins: PluginService.getDisabledPluginsStream(),
      pluginSettings: PluginService.getPluginSettingsStream(),
    };
  },

  methods: {
    toggleConfig(plugin) {
      const show = !this.showSettings[plugin.id];
      this.$set(this.showSettings, plugin.id, show);
      if (show) {
        this.$set(
          this.settingsValues,
          plugin.id,
          this.settingsValues[plugin.id] || {}
        );
        plugin.settings.forEach((setting) => {
          let defaultValue;
          switch (setting.type) {
            case "string":
              defaultValue = "";
              break;
          }
          const currentValue = this.pluginSettings?.[plugin.id]?.[setting.id];
          this.$set(
            this.settingsValues[plugin.id],
            setting.id,
            currentValue === undefined ? defaultValue : currentValue
          );
        });
      }
    },

    togglePlugin(pluginId, value) {
      PluginService.togglePlugin(pluginId, value);
    },

    saveSettings(plugin) {
      PluginService.updatePluginSettings(
        plugin.id,
        this.settingsValues[plugin.id]
      );
      this.toggleConfig(plugin);
    },
  },
};
</script>

<style scoped lang="scss">
.name {
  font-size: 120%;
  font-weight: bold;
}
.author {
  font-size: 80%;
  color: #666;
}
</style>
