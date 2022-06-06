export default {
  title: "Game UI/Disconnect",
};

export const shown = () => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(true),
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};

export const hidden = () => {
  GameService.mock({
    getDisconnectionDetectedStream: () => Rx.Observable.of(false),
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};

export const inAndOut = () => {
  const stream = new Rx.ReplaySubject(1);
  let state = false;
  stream.next(state);

  setInterval(() => {
    state = !state;
    stream.next(state);
  }, 1000);

  GameService.mock({
    getDisconnectionDetectedStream: () => stream,
  });

  return {
    template: `
<div>
  <DisconnectIndicator />
</div>
`,
  };
};
inAndOut.parameters = {
  storyshots: { disable: true },
};
