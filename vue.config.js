const { gitDescribeSync } = require("git-describe");
process.env.VUE_APP_GIT_HASH = gitDescribeSync({
  customArguments: ["--abbrev=8"],
}).hash;

module.exports = {
  parallel: 1,
  productionSourceMap: false,
  configureWebpack: {
    devtool: false,
  },
};
