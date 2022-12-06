module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../server/**/*.server.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/preset-scss"],
  webpackFinal: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(ogg)$/,
        loader: "file-loader",
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
