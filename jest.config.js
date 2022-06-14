module.exports = {
  moduleNameMapper: {
    "rx\\.js": "<rootDir>/src/rx.js",
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|ogg)$":
      "<rootDir>/.storybook/utils/emptyMock.js",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.*\\.(vue)$": "<rootDir>/node_modules/jest-vue-preprocessor",
    "^.*\\.(vue)$": "jest-vue-preprocessor",
  },
};
