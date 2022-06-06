import "./chat.js";

ChatService.mock = (object) => {
  Object.keys(object).forEach((method) => {
    ChatService[method] = object[method];
  });
};
