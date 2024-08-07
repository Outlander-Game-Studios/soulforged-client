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
    config.module.unknownContextCritical = false;
    config.optimization = {
      minimize: false,
      minimizer: [],
    };
    config.resolve.alias["@/rx.js"] = require.resolve("../src/rx.js");
    return config;
  },
};
