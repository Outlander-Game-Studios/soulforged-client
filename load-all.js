import Vue from "vue";

const components = {};
const allPlugins = {};

if (typeof require.context === "undefined") {
  require.context = () => ({
    keys: () => [],
  });
}

const requireComponents = require.context("./src/components/", true, /\.vue$/);
requireComponents.keys().forEach((fileName) => {
  const componentName = fileName
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");

  if (components[componentName]) {
    throw new Error(
      `Duplicate component definition found: ${componentName}, found in:\n${fileName}\n${components[componentName]}`
    );
  }
  components[componentName] = fileName;
  Vue.component(componentName, requireComponents(fileName).default);
});

const pluginSources = require.context("./src/plugins/", true, /\.vue$/);

const pluginDefinitions = require.context(
  "./src/plugins/",
  true,
  /\/spec\.json$/
);
pluginDefinitions.keys().forEach((fileName) => {
  const spec = pluginDefinitions(fileName);
  const pluginPath = fileName.replace("spec.json", "");

  spec.id = pluginPath.replace(/^.\//, "").replace(/\/$/, "");
  if (allPlugins[spec.name]) {
    spec.error = `Conflicting plugin name: ${spec.name}, found in:\n${fileName}`;
  } else {
    spec.componentNames = {};
    Object.keys(spec.additions).forEach((slot) => {
      const file = spec.additions[slot];
      try {
        const componentName = `PLUGIN_${spec.id}___${slot}`.replace(/-/g, "_");
        spec.componentNames[slot] = componentName;
        Vue.component(
          componentName,
          pluginSources(`${pluginPath}${file}`).default
        );
      } catch (e) {
        spec.error = `Error in ${file}: ${e.toString()}`;
        console.warn(`Failed to load plugin ${fileName}: ${spec.error}`);
      }
    });
  }

  allPlugins[spec.name] = spec;
});

console.log(allPlugins);
global.allPlugins = Object.values(allPlugins);
