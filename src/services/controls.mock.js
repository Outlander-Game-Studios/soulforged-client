import "./controls.js";

ControlsService.mock = (object) => {
  Object.keys(object).forEach((method) => {
    ControlsService[method] = object[method];
  });
};
