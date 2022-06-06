import Vue from "vue";

const components = {};

const getFiles = () => {
  if (typeof require.context === "undefined") {
    require.context = () => ({
      keys: () => [],
    });
  }
  return require.context("./", true, /\.vue$/);
};

const requireComponents = getFiles();
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
