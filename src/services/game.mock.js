import "./game.js";

GameService.mock = (object) => {
  Object.keys(object).forEach((method) => {
    GameService[method] = object[method];
  });
};

const requestHandlers = {};
GameService.mockRequest = (type, handler = () => {}) => {
  requestHandlers[type] = handler;
};

GameService.mock({
  request: (type, ...args) => {
    if (requestHandlers[type]) {
      return Promise.resolve(requestHandlers[type](...args));
    }
    throw new Error(
      "Fatal Error: A method in GameService was not mocked correctly. Arguments: " +
        JSON.stringify([type, ...args])
    );
  },
  reconnect: (...args) => {
    throw new Error(
      "Fatal Error: A method in GameService was not mocked correctly. Arguments: " +
        JSON.stringify(args)
    );
  },
});

console.log("Mock localStorage.getItem");
localStorage.getItem = () => undefined;
