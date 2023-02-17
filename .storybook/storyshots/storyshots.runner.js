const { default: initStoryshots } = require("@storybook/addon-storyshots");
const { imageSnapshot } = require("@storybook/addon-storyshots-puppeteer");
const devices = require("puppeteer-core/DeviceDescriptors");

process.setMaxListeners(30);

global.window = global.window || {
  navigator: {
    userAgent: "",
  },
};

const beforeScreenshot = async (page) => {
  await page.addStyleTag({
    content: `
    *,
    *::after,
    *::before {
      caret-color: transparent;
      animation-duration: 0s !important;
      animation-play-state: paused !important;
      transition-duration: 0s !important;
      transition: none !important;
    }
  `,
  });
  return page;
};

const selectedDevices = [
  devices["iPhone 5"],
  devices["iPhone 5 landscape"],
  devices["Pixel 2"],
  devices["Pixel 2 landscape"],
  devices["iPad"],
  devices["iPad landscape"],
];

const testDevice = (device = {}) =>
  imageSnapshot({
    beforeScreenshot,
    storybookUrl: `file://${__dirname}/../dist`,
    customizePage: async (page) => {
      if (device.userAgent) {
        await page.emulate(device);
      }
      return page;
    },
    getMatchOptions: (config, ...args) => {
      const {
        context: { kind, story },
      } = config;
      const { viewport = {} } = device;
      const customSnapshotIdentifier = (
        `${kind}--${story}-` +
        `${device.name}-` +
        `${viewport.width}x${viewport.height}`
      )
        .replace(/[^a-z0-9-]/gi, "_")
        .replace(/_+/g, "_")
        .toLowerCase();

      let customSnapshotsDir;
      const { fileName } = config.context.parameters;
      switch (true) {
        case fileName.includes(".server.stories.js"):
          customSnapshotsDir = `${__dirname}/../../server/storyshots-snapshots`;
          break;
        case fileName.includes(".world.stories.js"):
          customSnapshotsDir = `${__dirname}/../../world/storyshots-snapshots`;
          break;
        default:
          customSnapshotsDir = `${__dirname}/storyshots-snapshots`;
      }

      return {
        customDiffConfig: {
          threshold: 0.09,
        },
        failureThresholdType: "percent",
        failureThreshold: 0,
        customSnapshotsDir,
        customSnapshotIdentifier,
      };
    },
  });

const testScopes = {
  minimum: 1,
  medium: 2,
  extended: selectedDevices.length,
};
const defaultScope = "minimum";
const devicesSpecs = selectedDevices.map((device) => testDevice(device));

function testAll(...args) {
  const [{ story }] = args;
  const testScope =
    testScopes[story.parameters.storyshotsScope || defaultScope];
  if (!testScope) {
    throw new Error(
      `Invalid storyshots scope: ${story.parameters.storyshotsScope}`
    );
  }
  return devicesSpecs
    .slice(0, testScope)
    .reduce((acc, is) => acc.then(() => is(...args)), Promise.resolve());
}
testAll.timeout = 30000;
testAll.beforeAll = () => {
  return Promise.all(devicesSpecs.map((is) => is.beforeAll()));
};
testAll.afterAll = () => {
  return Promise.all(devicesSpecs.map((is) => is.afterAll()));
};

initStoryshots({
  suite: "Image storyshots",
  test: testAll,
});
