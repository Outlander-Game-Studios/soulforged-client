module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../server/**/*.server.stories.@(js|jsx|ts|tsx)",
    "../world/**/*.world.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-controls",
    "@storybook/preset-scss",
  ],
  staticDirs: ["../world/assets/dungeons"],
  webpackFinal: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(ogg)$/,
        loader: "file-loader",
      },
      {
        test: /\.(html|txt)$/,
        loader: "raw-loader",
      },
    ];
    config.module.rules = config.module.rules.map((rule) => { // Necessary to load specific vue package version, apparently
      if (!rule.use) return rule; 

      rule.use = rule.use.filter((loader) =>
        typeof loader === "string"
          ? !loader.includes("vue-docgen-loader")
          : !(loader.loader && loader.loader.includes("vue-docgen-loader"))
      );

      return rule;
    });
    config.module.unknownContextCritical = false;
    config.optimization = {
      minimize: false,
      minimizer: [],
    };
    config.resolve.alias["@/rx.js"] = require.resolve("../src/rx.js");
    return config;
  },
  features: { // Forces storybook version on the one we use regardless of version
    babelModeV7: true, 
    storyStoreV7: true,
  },
  core: { // Forces webpack4
    builder: "webpack4",
  },
};
