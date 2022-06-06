function stacktrace() {
  try {
    throw new Error();
  } catch (e) {
    return e.stack;
  }
}

const failsOnce = {};
function throwOnce(message) {
  if (!failsOnce[message]) {
    failsOnce[message] = true;
    throw new Error(message);
  }
}

global.debug = {
  stacktrace,
  throwOnce,
};

export { stacktrace, throwOnce };
